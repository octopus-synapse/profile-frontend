'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { motion } from 'framer-motion';
import { ArrowLeft, Github } from 'lucide-react';
import { SignInForm } from '@/components/auth';
import { PatchLogo } from '@/components/navigation/patch-logo';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

export default function SignInPage() {
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
            href={ROUTES.HOME}
            className="group flex items-center gap-2 transition-colors hover:text-white"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              strokeWidth={2}
            />
            <span className="font-mono text-xs tracking-widest uppercase">{t('auth.back')}</span>
          </LocalizedLink>
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
            <div className="mb-6 flex justify-center">
              <PatchLogo className="h-14 w-auto" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {t('auth.signIn.title')}
            </h1>
          </div>

          {/* Form Card com borda "Glass" */}
          <div className="group relative">
            {/* Efeito de borda gradiente no hover */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-purple-500/50 opacity-20 blur transition duration-1000 group-hover:opacity-40" />

            <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-8 shadow-2xl backdrop-blur-2xl">
              <SignInForm />

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/5" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0A0A0A] px-2 font-mono tracking-widest text-zinc-600">
                    {t('auth.or')}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                tone="neutral"
                size="lg"
                fullWidth
                leftIcon={<Github className="h-4 w-4" />}
              >
                {t('auth.continueWithGithub')}
              </Button>
            </div>
          </div>

          {/* Footer Sign Up */}
          <p className="mt-8 text-center font-mono text-xs text-zinc-500">
            {t('auth.signIn.noAccount')}{' '}
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              className="font-bold text-white underline-offset-4 hover:underline"
            >
              {t('auth.signIn.createAccount')}
            </LocalizedLink>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
