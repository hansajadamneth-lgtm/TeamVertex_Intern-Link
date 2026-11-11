import { NextResponse } from "next/server";

/**
 * Check whether a remote Express backend URL is configured
 */
export function isBackendConfigured(): boolean {
  return Boolean(process.env.BACKEND_URL || process.env.API_BASE_URL);
}

/**
 * Server-only utility to forward Next.js API requests to the Express backend
 * when BACKEND_URL or API_BASE_URL is configured in environment variables.
 */
export async function forwardToBackend(
  request: Request,
  backendPath: string
): Promise<Response | null> {
  const backendBase =
    process.env.BACKEND_URL || process.env.API_BASE_URL;

  // If no backend URL is configured, return null so routes can use local preview fallback
  if (!backendBase) {
    return null;
  }

  try {
    const url = new URL(request.url);
    // All browser API calls must be same-origin. Next.js is the public boundary;
    // Express is reached server-to-server and does not need a browser Origin.
    // Prevent CSRF here instead of relying on Render's CLIENT_URL being exact.
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method.toUpperCase())) {
      const origin = request.headers.get("origin");
      const fetchSite = request.headers.get("sec-fetch-site");
      if (fetchSite === "cross-site" || (origin && origin !== url.origin)) {
        return NextResponse.json(
          { success: false, message: "Request origin is not permitted." },
          { status: 403, headers: { "Cache-Control": "no-store" } }
        );
      }
    }
    const targetUrl = `${backendBase.replace(/\/$/, "")}${backendPath}${url.search}`;

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Do not let callers spoof a reverse-proxy client IP or hop-by-hop headers.
      const blocked = new Set(["host", "connection", "content-length", "transfer-encoding", "keep-alive",
        "upgrade", "proxy-authorization", "proxy-authenticate", "forwarded", "via",
        "x-forwarded-for", "x-forwarded-host", "x-forwarded-proto", "x-real-ip",
        "cf-connecting-ip", "true-client-ip", "accept-encoding", "origin"]);
      if (!blocked.has(lower)) {
        headers[key] = value;
      }
    });

    const init: RequestInit = {
      method: request.method,
      headers,
    };

    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method.toUpperCase())) {
      try {
        const bodyText = await request.text();
        if (bodyText) {
          init.body = bodyText;
        }
      } catch {
        // Request body empty or already consumed
      }
    }

    const backendResponse = await fetch(targetUrl, init);
    const responseData = await backendResponse.text();

    const forwardHeaders = new Headers();
    backendResponse.headers.forEach((val, key) => {
      const lower = key.toLowerCase();
      if (lower === "set-cookie") {
        forwardHeaders.append(key, val);
      } else if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(lower)) {
        forwardHeaders.set(key, val);
      }
    });

    forwardHeaders.set("Cache-Control", "no-store");

    return new Response(responseData, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: forwardHeaders,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Backend Proxy Error (${backendPath}):`, error.message);
    return NextResponse.json(
      {
        success: false,
        message:
          "Express backend service is currently unreachable or warming up (free-tier cold start). Please retry shortly.",
        ...(process.env.NODE_ENV !== "production" ? { error: error.message } : {}),
      },
      { status: 503 }
    );
  }
}
