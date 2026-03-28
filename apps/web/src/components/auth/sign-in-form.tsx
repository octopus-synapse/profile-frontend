'use client';

/**
 * Sign In Form Component
 */

import { useT } from '@profile/i18n';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import { Spinner } from '@/shared/components/ui';
import { AuthSubmitButton } from './auth-submit-button';
import { EmailField } from './email-field';
import { FormErrorAlert } from './form-error-alert';
import { useSignIn } from './hooks/use-sign-in';
import { SignInPasswordField } from './sign-in-password-field';
import { TwoFactorLoginChallenge } from './two-factor/login-challenge';

function SignInFormContent() {
  const t = useT();
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    twoFactorRequired,
    twoFactorUserId,
    completeLogin,
    handleSubmit,
  } = useSignIn();

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
      animate={{ opacity: 1, scale: 1, x: error ? [0, -4, 4, -4, 4, 0] : 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
        <FormErrorAlert message={error} />
        <EmailField label={t('auth.signIn.email')} value={email} onChange={setEmail} required />
        <SignInPasswordField
          label={t('auth.signIn.password')}
          forgotPasswordLabel={t('auth.signIn.forgotPassword')}
          value={password}
          onChange={setPassword}
        />
        <AuthSubmitButton label={t('auth.signIn.submit')} isLoading={isLoading} />
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
