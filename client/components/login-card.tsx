"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function LoginCard() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Invalid email or password");
        return;
      }

      setSuccess("Login successful!");

      const destination = data.user?.role === "admin" ? "/admin/dashboard"
        : data.user?.role === "employer" ? "/employer" : "/home";
      router.replace(destination);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">
          Login to Your Account
        </h2>

        <p className="text-sm text-gray-500">
          Enter your credentials to continue
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>

            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((v) => !v)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-il-orange hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-xl bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* Login button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200" />

            <span className="mx-3 text-xs text-gray-400">
              OR
            </span>

            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Register */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-il-orange hover:underline"
            >
              Register
            </Link>
          </p>

        </form>
      </CardContent>
    </Card>
  );
}