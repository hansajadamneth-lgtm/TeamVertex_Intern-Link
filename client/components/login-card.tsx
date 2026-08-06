"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.28 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.62H1.27A11.96 11.96 0 000 12c0 1.93.46 3.76 1.27 5.38l4-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

export function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to your auth logic here.
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-il-orange/10">
          <Lock className="h-7 w-7 text-il-orange" />
        </span>
        <h2 className="text-2xl font-bold text-gray-900">
          Login to Your Account
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter your credentials to continue
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10"
                required
              />
            </div>
          </div>

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
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
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
                href="#"
                className="text-xs font-medium text-il-orange hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 text-xs text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            size="lg"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="#"
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
