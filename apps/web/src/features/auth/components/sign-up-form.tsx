"use client";

/**
 * Sign Up Form Component
 * GitHub + Cursor inspired design
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth-service";
import { useAuth } from "../hooks/use-auth";
import { useT } from "@/features/i18n";
import { Button, Input } from "@/shared/components/ui";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/config/routes";
import { AlertCircle, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export function SignUpForm() {
  const t = useT();
  const router = useRouter();
  const { signIn } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="border-pf-danger-muted bg-pf-danger-subtle text-pf-danger-fg animate-fade-in flex items-center gap-3 rounded-md border p-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-pf-fg-default">
          {t("auth.signUp.name")}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <User className="text-pf-fg-muted h-4 w-4" />
          </div>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
            className="pl-10"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-pf-fg-default">
          {t("auth.signUp.email")}
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
        <Label htmlFor="password" className="text-pf-fg-default">
          {t("auth.signUp.password")}
        </Label>
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
            autoComplete="new-password"
            error={!!error}
            className="pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-pf-fg-muted hover:text-pf-fg-default absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="text-pf-fg-subtle text-xs">Minimum 8 characters</p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-pf-fg-default">
          {t("auth.signUp.confirmPassword")}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Lock className="text-pf-fg-muted h-4 w-4" />
          </div>
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
            error={!!error}
            className="pr-10 pl-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-pf-fg-muted hover:text-pf-fg-default absolute inset-y-0 right-0 flex items-center pr-3 transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="mt-6 w-full" size="lg" loading={isLoading}>
        {isLoading ? "Creating account..." : t("auth.signUp.submit")}
      </Button>

      {/* Terms */}
      <p className="text-pf-fg-muted pt-2 text-center text-xs">
        By creating an account, you agree to our{" "}
        <a href="#" className="text-pf-accent-fg hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-pf-accent-fg hover:underline">
          Privacy Policy
        </a>
      </p>
    </form>
  );
}
