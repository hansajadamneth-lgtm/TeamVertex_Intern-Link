"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StepNumber } from "@/components/step-number";

export function ForgotPasswordCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to your real "send verification code" logic here.
  }

  function handleReset(e: React.FormEvent) {
    e.preventDefault();
    // Wire up to your real "reset password" logic here.
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="items-center pb-0 text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-il-orange/10">
          <Lock className="h-7 w-7 text-il-orange" />
        </span>
        <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-1 text-sm text-gray-400">
          Enter your registered email address.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSendCode} className="space-y-2">
          <div className="flex items-center gap-2">
            <StepNumber step={1} />
            <Label htmlFor="email">Email Address</Label>
          </div>
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
          <Button type="submit" className="w-full" size="lg">
            Send Verification Code
          </Button>
        </form>

        <div className="my-5 border-t border-gray-100" />

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StepNumber step={2} />
              <Label htmlFor="code">Verification Code</Label>
            </div>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                className="pl-10 pr-24"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-il-orange hover:underline"
              >
                Resend code
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StepNumber step={3} />
              <Label htmlFor="new-password">New Password</Label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pl-10 pr-10"
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
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <StepNumber step={4} />
              <Label htmlFor="confirm-password">Confirm Password</Label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Reset Password
          </Button>

          <p className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-semibold text-il-orange hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
