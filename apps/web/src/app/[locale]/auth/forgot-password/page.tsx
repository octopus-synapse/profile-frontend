"use client";

import { ForgotPasswordForm } from "@/features/auth";
import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";
import { ArrowLeft, Mail } from "lucide-react";
import { useI18n } from "@/features/i18n";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const { t } = useI18n();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#030303] text-slate-300">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 bg-cyan-500/10 opacity-50 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <LocalizedLink
            href={ROUTES.AUTH.SIGN_IN}
            className="group flex items-center gap-2 transition-colors hover:text-white"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span className="font-mono text-xs tracking-widest uppercase">
              {t("auth.forgotPassword.backToSignIn")}
            </span>
          </LocalizedLink>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-mono text-[10px] tracking-tighter uppercase">System Online</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo/Title Section */}
          <div className="mb-10 text-center">
            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-2xl">
              <Mail className="h-6 w-6 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
              {t("auth.forgotPassword.title")}
            </h1>
            <p className="text-sm text-zinc-500">{t("auth.forgotPassword.subtitle")}</p>
          </div>

          {/* Form Card com borda "Glass" */}
          <div className="group relative">
            {/* Efeito de borda gradiente no hover */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-purple-500/50 opacity-20 blur transition duration-1000 group-hover:opacity-40" />

            <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-8 shadow-2xl backdrop-blur-2xl">
              <ForgotPasswordForm />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

