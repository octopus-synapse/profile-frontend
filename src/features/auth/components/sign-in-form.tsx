"use client";

/**
 * Sign In Form Component
 * Handles user authentication
 */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../hooks/use-auth";
import { useT } from "@/features/i18n";
import { Button, Input, Spinner } from "@/shared/components/ui";
import { ROUTES } from "@/config/routes";
import { AlertCircle } from "lucide-react";

function SignInFormContent() {
  const t = useT();
  const { signIn } = useAuth();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          {t("auth.signIn.email")}
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          autoComplete="email"
          error={!!error}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
            {t("auth.signIn.password")}
          </label>
          <Link
            href={ROUTES.AUTH.FORGOT_PASSWORD}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {t("auth.signIn.forgotPassword")}
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          error={!!error}
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        {t("auth.signIn.submit")}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        {t("auth.signIn.noAccount")}{" "}
        <Link href={ROUTES.AUTH.SIGN_UP} className="font-medium text-blue-400 hover:text-blue-300">
          {t("auth.signIn.createAccount")}
        </Link>
      </p>
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
