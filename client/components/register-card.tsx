"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  UserPlus,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

export function RegisterCard() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"student" | "employer">("student");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 10 || password.length > 128) {
      setError("Password must be between 10 and 128 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            email,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        "Unable to connect to the server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-2 shadow-2xl">
      <CardHeader className="items-center pb-2 text-center">
        {/* Circle UserPlus Badge */}
        <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100/70">
          <UserPlus className="h-6 w-6 text-[#FF6B35]" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          Create Your Account
        </h2>
        <p className="mt-0.5 text-xs text-gray-400">
          Fill in the details below to get started.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="fullName" className="text-xs font-semibold text-gray-800">
              Full Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                className="h-11 rounded-xl pl-10 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-gray-800">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="h-11 rounded-xl pl-10 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                minLength={10}
                maxLength={128}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="h-11 rounded-xl pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold text-gray-800">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  minLength={10}
                  maxLength={128}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="h-11 rounded-xl pl-10 pr-10 text-sm text-gray-800 placeholder:text-gray-300 focus:border-[#FF6B35] focus:ring-[#FF6B35]/20"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-semibold text-gray-800">
              I am a
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition ${
                  role === "student"
                    ? "border-[#FF6B35] bg-orange-50/60 text-gray-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    role === "student"
                      ? "border-[#FF6B35]"
                      : "border-gray-300"
                  }`}
                >
                  {role === "student" && (
                    <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                  )}
                </span>
                <GraduationCap
                  className={`h-4 w-4 ${
                    role === "student" ? "text-[#FF6B35]" : "text-gray-500"
                  }`}
                />
                <span>Student / Job Seeker</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("employer")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition ${
                  role === "employer"
                    ? "border-[#FF6B35] bg-orange-50/60 text-gray-900"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span
                  className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                    role === "employer"
                      ? "border-[#FF6B35]"
                      : "border-gray-300"
                  }`}
                >
                  {role === "employer" && (
                    <span className="h-2 w-2 rounded-full bg-[#FF6B35]" />
                  )}
                </span>
                <Building2
                  className={`h-4 w-4 ${
                    role === "employer" ? "text-[#FF6B35]" : "text-gray-500"
                  }`}
                />
                <span>Employer / Company</span>
              </button>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              required
              className="h-4 w-4 rounded border-gray-300 text-[#FF6B35] focus:ring-[#FF6B35]"
            />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the{" "}
              <Link href="/terms-of-service" className="font-semibold text-[#FF6B35] hover:underline">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="font-semibold text-[#FF6B35] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-medium text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="rounded-xl bg-green-50 p-3 text-xs font-medium text-green-600 border border-green-100">
              {success}
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="relative flex h-12 w-full items-center justify-center rounded-xl bg-[#FF6B35] text-base font-semibold text-white shadow-md hover:bg-[#e05a28] transition-all"
            disabled={loading}
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
              <LogOut className="h-5 w-5 text-white" />
            </div>
          </Button>

          {/* Divider */}
          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-4 text-xs font-semibold text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>

          {/* Sign in redirect link */}
          <p className="pt-1 text-center text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#FF6B35] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}