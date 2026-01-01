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
import { AlertCircle, User, Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-cyan-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
        >
          {t("auth.signUp.name")}
        </Label>
        <div className="group relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <User className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
          </div>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            autoComplete="name"
            className="h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
        >
          {t("auth.signUp.email")}
        </Label>
        <div className="group relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
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
            className="h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
        >
          {t("auth.signUp.password")}
        </Label>
        <div className="group relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
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
            className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {/* Password Strength Indicator */}
        {password && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((level) => {
                const strength = getPasswordStrength(password);
                return (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      level <= strength.score ? strength.color : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>
            <p
              className={`ml-1 font-mono text-[10px] ${
                getPasswordStrength(password).score <= 1
                  ? "text-red-400"
                  : getPasswordStrength(password).score <= 2
                    ? "text-amber-400"
                    : getPasswordStrength(password).score <= 3
                      ? "text-cyan-400"
                      : "text-emerald-400"
              }`}
            >
              {getPasswordStrength(password).label}
            </p>
          </div>
        )}
        <p className="ml-1 font-mono text-[10px] text-zinc-600">{t("auth.signUp.passwordHint")}</p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
        >
          {t("auth.signUp.confirmPassword")}
        </Label>
        <div className="group relative">
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
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
            className="h-11 border-white/10 bg-white/[0.02] pr-10 pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-white"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="group relative mt-6 h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-cyan-400 active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="font-mono text-xs">{t("auth.loading.creatingAccount")}</span>
        ) : (
          <span className="relative z-10 flex items-center justify-center gap-2">
            {t("auth.signUp.submit")}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
      </Button>
    </form>
  );
}
