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

  // Never allow demo authentication or mock API responses in production.
  if (!backendBase) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, message: "Backend service is not configured." },
        { status: 503 }
      );
    }
    return null;
  }

  try {
    const url = new URL(request.url);
    const targetUrl = `${backendBase.replace(/\/$/, "")}${backendPath}${url.search}`;

    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Forward relevant client headers but avoid forwarding host, connection, content-length
      if (lower !== "host" && lower !== "connection" && lower !== "content-length") {
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
      } else if (!["content-encoding", "transfer-encoding"].includes(lower)) {
        forwardHeaders.set(key, val);
      }
    });

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
      },
      { status: 503 }
    );
  }
}
