'use client';

/**
 * Sign Up Page
 * Ultra Premium dark theme - matching sign-in
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Github, Terminal, Zap } from 'lucide-react';
import { SignUpForm } from '@/components/auth';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';

export default function SignUpPage() {
  const { t } = useI18n();

  const features = [
    { textKey: 'auth.signUp.features.profiles', done: true },
    { textKey: 'auth.signUp.features.export', done: true },
    { textKey: 'auth.signUp.features.analytics', done: true },
    { textKey: 'auth.signUp.features.github', done: true },
  ];

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#030303] text-zinc-300">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 bg-cyan-500/10 opacity-50 blur-[120px]" />
      </div>

      {/* Left side - Feature showcase (hidden on mobile) */}
      <div className="relative z-10 hidden flex-col justify-between border-r border-white/5 bg-black/40 p-12 backdrop-blur-xl lg:flex lg:w-1/2">
        <div>
          <LocalizedLink href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <Zap className="h-4 w-4 text-white" strokeWidth={1.5} />
            </div>
            <span className="font-mono text-lg font-bold text-white">PATCH</span>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-[9px] text-cyan-400">
              dev
            </span>
          </LocalizedLink>
        </div>

        <div className="space-y-8">
          {/* Code Block */}
          <div className="max-w-md overflow-hidden rounded-xl border border-white/10 bg-black/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-white/5 bg-black/40 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="ml-2 font-mono text-[10px] text-zinc-500">welcome.ts</span>
            </div>
            <div className="p-5 font-mono text-[11px] leading-relaxed text-zinc-400">
              <div>
                <span className="text-pink-400">const</span>{' '}
                <span className="text-cyan-300">createProfile</span> ={' '}
                <span className="text-pink-400">async</span> () =&gt; {'{'}
              </div>
              <div className="ml-4">
                <span className="text-pink-400">return</span> {'{'}
              </div>
              <div className="ml-8">
                <span className="text-blue-400">status</span>:{' '}
                <span className="text-emerald-400">&quot;success&quot;</span>,
              </div>
              <div className="ml-8">
                <span className="text-blue-400">message</span>:{' '}
                <span className="text-emerald-400">&quot;Profile created!&quot;</span>
              </div>
              <div className="ml-4">{'}'}</div>
              <div>{'}'}</div>
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 font-mono text-sm text-zinc-400"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </div>
                <span>{t(feature.textKey as Parameters<typeof t>[0])}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="font-mono text-xs text-zinc-600">
          © {new Date().getFullYear()} PATCH. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/20 p-4 backdrop-blur-md lg:border-b-0">
          <div className="flex items-center justify-between">
            <LocalizedLink
              href={ROUTES.HOME}
              className="group flex items-center gap-2 text-zinc-500 transition-colors hover:text-white"
            >
              <ArrowLeft
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                strokeWidth={2}
              />
              <span className="font-mono text-xs uppercase tracking-widest">{t('auth.back')}</span>
            </LocalizedLink>
            <LocalizedLink href={ROUTES.HOME} className="flex items-center gap-2 lg:hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500">
                <Zap className="h-4 w-4 text-white" strokeWidth={1.5} />
              </div>
              <span className="font-mono text-sm font-bold text-white">PATCH</span>
            </LocalizedLink>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 lg:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-mono text-[10px] uppercase tracking-tighter">
                System Online
              </span>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-[400px]"
          >
            {/* Header */}
            <div className="mb-10 text-center">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-b from-white/10 to-transparent shadow-2xl lg:hidden">
                <Terminal className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
                {t('auth.signUp.title')}
              </h1>
              <div className="flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                <span className="text-amber-400">●</span>
                <span>new_user: true</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/50 to-purple-500/50 opacity-20 blur transition duration-1000 group-hover:opacity-40" />

              <div className="relative rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-8 shadow-2xl backdrop-blur-2xl">
                {/* GitHub OAuth */}
                <span className="mb-6 block">
                  <Button
                    type="button"
                    variant="outline"
                    tone="neutral"
                    size="lg"
                    fullWidth
                    leftIcon={<Github className="h-4 w-4" strokeWidth={1.5} />}
                  >
                    {t('auth.continueWithGithub')}
                  </Button>
                </span>

                {/* Divider */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0A0A0A] px-2 font-mono tracking-widest text-zinc-600">
                      {t('auth.or')}
                    </span>
                  </div>
                </div>

                {/* Sign Up Form */}
                <SignUpForm />
              </div>
            </div>

            {/* Footer */}
            <p className="mt-8 text-center font-mono text-xs text-zinc-500">
              {t('auth.signUp.hasAccount')}{' '}
              <LocalizedLink
                href={ROUTES.AUTH.SIGN_IN}
                className="font-bold text-white underline-offset-4 hover:underline"
              >
                {t('auth.signUp.signIn')}
              </LocalizedLink>
            </p>

            {/* Terms */}
            <p className="mt-4 text-center font-mono text-[10px] text-zinc-600">
              By signing up, you agree to our{' '}
              <LocalizedLink href="/terms" className="underline hover:text-white">
                {t('auth.terms')}
              </LocalizedLink>{' '}
              and{' '}
              <LocalizedLink href="/privacy" className="underline hover:text-white">
                {t('auth.privacy')}
              </LocalizedLink>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
