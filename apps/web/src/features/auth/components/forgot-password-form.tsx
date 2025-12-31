"use client";

/**
 * Forgot Password Form Component
 * Ultra Premium Version - Inspired by Linear, Vercel & Cursor
 */

import { useState } from "react";
import { authService } from "../services/auth-service";
import { useT } from "@/features/i18n";
import { Button, Input, Spinner } from "@/shared/components/ui";
import { Label } from "@/shared/components/ui/label";
import { AlertCircle, Mail, CheckCircle2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ForgotPasswordForm() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const result = await authService.forgotPassword(email);
      
      // Only show success if email was actually sent
      if (result.emailSent) {
        setSuccess(true);
        setEmail(""); // Clear email after successful submission
      } else {
        // Email was not sent (user doesn't exist or email service failed)
        setError(t("auth.error.emailNotSent") || "Unable to send reset email. Please try again later.");
      }
    } catch (err) {
      // Email service failed or other error
      const errorMessage = err instanceof Error ? err.message : "";
      if (errorMessage.includes("Forbidden") || errorMessage.includes("email")) {
        setError(t("auth.error.emailServiceError") || "Email service is temporarily unavailable. Please try again later.");
      } else {
        setError(t("error.generic"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: error ? [0, -4, 4, -4, 4, 0] : 0,
      }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Success Alert */}
        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 font-mono text-xs text-emerald-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{t("auth.forgotPassword.success")}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field */}
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="ml-1 font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
          >
            {t("auth.forgotPassword.email")}
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
              placeholder="name@company.com"
              required
              disabled={success || isLoading}
              className="h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading || success}
          className="group relative h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? (
            <Spinner size="sm" className="border-black/20 border-t-black" />
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t("auth.forgotPassword.submit")}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}

          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        </Button>

        {/* Status indicator (footer form) */}
        <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[10px] tracking-tighter text-zinc-600 uppercase">
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>Encrypted</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

