'use client';

/**
 * Sign In Form - Ultra Premium Version
 * Inspired by Linear, Vercel & Cursor
 */

import { authLogin, getAuthSessionQueryKey } from '@profile/api-client';
import { useT } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ChevronRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { Button, Input, Spinner } from '@/shared/components/ui';
import { Label } from '@/shared/components/ui/label';
import { TwoFactorLoginChallenge } from './two-factor/login-challenge';

function SignInFormContent() {
  const t = useT();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.PROTECTED.PROFILE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 2FA challenge state
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState('');

  const completeLogin = async () => {
    await queryClient.invalidateQueries({
      queryKey: getAuthSessionQueryKey(),
    });
    router.push(callbackUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await authLogin({ email, password });

      const status = response.status as number;
      if (status === 200 || status === 201) {
        // Backend wraps responses as { success, data: LoginResponseDto }
        // while the SDK type expects LoginResponseDto directly
        const raw = response.data as unknown as {
          data?: { twoFactorRequired?: boolean; userId?: string };
          twoFactorRequired?: boolean;
          userId?: string;
        };
        const loginData = raw?.data ?? raw;

        if (loginData?.twoFactorRequired) {
          setTwoFactorUserId(loginData.userId ?? '');
          setTwoFactorRequired(true);
          return;
        }

        await completeLogin();
      } else {
        setError(t('auth.error.invalidCredentials'));
      }
    } catch {
      setError(t('error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  if (twoFactorRequired) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <TwoFactorLoginChallenge userId={twoFactorUserId} onVerified={() => void completeLogin()} />
      </motion.div>
    );
  }

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
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        {/* Error Alert */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
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
            {t('auth.signIn.email')}
          </Label>
          <div className="group relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Mail className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
            </div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="h-11 border-white/10 bg-white/[0.02] pl-10 transition-all focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label
              htmlFor="password"
              className="font-mono text-[10px] tracking-[0.15em] text-zinc-500 uppercase"
            >
              {t('auth.signIn.password')}
            </Label>
            <LocalizedLink
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="font-mono text-[10px] text-cyan-400/80 uppercase hover:text-cyan-400 hover:underline"
            >
              {t('auth.signIn.forgotPassword')}
            </LocalizedLink>
          </div>
          <div className="group relative">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-4 w-4 text-zinc-500 transition-colors group-focus-within:text-cyan-400" />
            </div>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
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
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="group relative h-12 w-full overflow-hidden rounded-lg bg-white text-sm font-bold text-black transition-all hover:bg-white/90 active:scale-[0.98]"
        >
          {isLoading ? (
            <Spinner size="sm" className="border-black/20 border-t-black" />
          ) : (
            <span className="relative z-10 flex items-center justify-center gap-2">
              {t('auth.signIn.submit')}
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
            <span>{t('auth.security.secureSession')}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1 w-1 rounded-full bg-cyan-500" />
            <span>{t('auth.security.encrypted')}</span>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function SignInFallback() {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Spinner size="lg" />
      <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
        {t('auth.loading.initializing')}
      </span>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInFormContent />
    </Suspense>
  );
}
