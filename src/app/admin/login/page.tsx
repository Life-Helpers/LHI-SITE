"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim()) {
      setErrorMessage("Please enter your staff or administrative email.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    // Simulate authentication verification
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lhi_admin_authenticated", "true");
        sessionStorage.setItem("lhi_admin_user", email);
      }
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    }, 900);
  }

  function handleFillDemo() {
    setEmail("admin@lhinigeria.org");
    setPassword("LHI-Staff#2026");
    setErrorMessage("");
  }

  return (
    <main id="main-content" tabIndex={-1} className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded text-sm text-muted-foreground hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to public website
          </Link>
        </div>

        <Card className="border-border bg-card/80 backdrop-blur-md shadow-lg">
          <CardHeader className="space-y-2 pb-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Admin & Staff Portal
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Authorized access for {siteConfig.name} trustees, field directors, and operations staff.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Authentication Confirmed</h2>
                <p className="text-sm text-muted-foreground">Redirecting to management dashboard…</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div
                    role="alert"
                    className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="admin-email">Staff Email / ID</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="admin-email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@lhinigeria.org"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password">Password</Label>
                    <button
                      type="button"
                      onClick={() => alert("Password reset instructions have been forwarded to the IT administrator at it-support@lhinigeria.org.")}
                      className="text-xs text-primary hover:underline focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-input text-primary focus:ring-ring"
                    />
                    <span>Remember workstation</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleFillDemo}
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    Use demo credentials
                  </button>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full mt-4" size="lg">
                  {isLoading ? "Authenticating…" : "Sign In to Portal"}
                </Button>

                <div className="mt-6 rounded-lg border border-border/80 bg-muted/40 p-3 text-center text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Official NGO Operations Portal</p>
                  <p className="mt-1">
                    Unauthorized access attempts are logged and monitored under LHI Information Security policies.
                  </p>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
