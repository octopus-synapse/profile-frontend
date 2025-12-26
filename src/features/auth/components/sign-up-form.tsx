"use client";

/**
 * Sign Up Form Component
 * Handles user registration
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "../services/auth-service";
import { useAuth } from "../hooks/use-auth";
import { useT } from "@/features/i18n";
import { Button, Input } from "@/shared/components/ui";
import { ROUTES } from "@/config/routes";
import { AlertCircle } from "lucide-react";

export function SignUpForm() {
  const t = useT();
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError(t("auth.error.passwordMismatch"));
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError(t("auth.error.weakPassword"));
      return;
    }

    setIsLoading(true);

    try {
      // Register user
      await authService.register({ email, password, name });

      // Auto sign in after registration
      const success = await signIn(email, password, ROUTES.ONBOARDING);

      if (!success) {
        // Registration succeeded but auto-login failed, redirect to sign in
        router.push(ROUTES.AUTH.SIGN_IN);
      }
    } catch (err) {
      // Check for email exists error
      const errorMessage = err instanceof Error ? err.message : "";
      if (errorMessage.includes("409") || errorMessage.includes("exists")) {
        setError(t("auth.error.emailExists"));
      } else {
        setError(t("error.generic"));
      }
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
        <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
          {t("auth.signUp.name")}
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
          {t("auth.signUp.email")}
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
        <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
          {t("auth.signUp.password")}
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={!!error}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
          {t("auth.signUp.confirmPassword")}
        </label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="new-password"
          error={!!error}
        />
      </div>

      <Button type="submit" className="w-full" loading={isLoading}>
        {t("auth.signUp.submit")}
      </Button>

      <p className="text-center text-sm text-zinc-400">
        {t("auth.signUp.hasAccount")}{" "}
        <Link href={ROUTES.AUTH.SIGN_IN} className="font-medium text-blue-400 hover:text-blue-300">
          {t("auth.signUp.signIn")}
        </Link>
      </p>
    </form>
  );
}
