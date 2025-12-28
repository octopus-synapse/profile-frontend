"use client";

/**
 * Sign In Form Component
 * GitHub + Cursor inspired design
 */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocalizedLink } from "@/shared/components/localized-link";
import { useAuth } from "../hooks/use-auth";
import { useT } from "@/features/i18n";
import { Button, Input, Spinner } from "@/shared/components/ui";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/config/routes";
import { AlertCircle, Mail, Lock, Eye, EyeOff } from "lucide-react";

function SignInFormContent() {
  const t = useT();
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await signIn(email, password, callbackUrl);

      if (!success) {
        setError(t("auth.error.invalidCredentials"));
      }
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="border-pf-danger-muted bg-pf-danger-subtle text-pf-danger-fg animate-fade-in flex items-center gap-3 rounded-md border p-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-pf-fg-default">
          {t("auth.signIn.email")}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Mail className="text-pf-fg-muted h-4 w-4" />
          </div>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            error={!!error}
            className="pl-10"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-pf-fg-default">
            {t("auth.signIn.password")}
          </Label>
          <LocalizedLink
            href={ROUTES.AUTH.FORGOT_PASSWORD}
            className="text-pf-accent-fg text-xs hover:underline"
          >
            {t("auth.signIn.forgotPassword")}
          </LocalizedLink>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="text-pf-fg-muted h-4 w-4" />
          </div>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            error={!!error}
            className="pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-pf-fg-muted hover:text-pf-fg-default absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-6 w-full" size="lg" loading={isLoading}>
        {isLoading ? "Signing in..." : t("auth.signIn.submit")}
      </Button>
    </form>
  );
}

// Wrap with Suspense for useSearchParams
export function SignInForm() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <Spinner size="md" />
        </div>
      }
    >
      <SignInFormContent />
    </Suspense>
  );
}
