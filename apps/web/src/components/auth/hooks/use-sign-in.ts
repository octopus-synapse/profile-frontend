'use client';

/**
 * useSignIn — Sign in form state and submit logic
 * Uses generated TanStack Query mutation for optimized caching and state management
 */

import {
  getAuthSessionQueryKey,
  isApiError,
  useAuthLogin,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';

export function useSignIn() {
  const t = useT();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { classifyError } = useErrorHandler();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? ROUTES.PROTECTED.PROFILE;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorUserId, setTwoFactorUserId] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getErrorMessage = useCallback(
    (err: unknown): string => {
      const classified = classifyError(err);
      if (classified.category === 'auth') return t('auth.error.invalidCredentials');
      if (classified.category === 'network') return t('error.network');
      if (isApiError(err)) return err.message;
      return t('error.generic');
    },
    [classifyError, t]
  );

  const completeLogin = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
    // Use Next.js router for client-side navigation (much faster than full page reload)
    router.push(callbackUrl);
  }, [queryClient, callbackUrl, router]);

  const loginMutation = useAuthLogin({
    mutation: {
      onSuccess: async (response) => {
        setErrorMessage(null);
        if (response.status === 200) {
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
          setErrorMessage(t('auth.error.invalidCredentials'));
        }
      },
      onError: (err) => {
        setErrorMessage(getErrorMessage(err));
      },
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMessage(null);
      loginMutation.mutate({ data: { email, password } });
    },
    [loginMutation, email, password]
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    error: errorMessage,
    isLoading: loginMutation.isPending,
    twoFactorRequired,
    twoFactorUserId,
    completeLogin,
    handleSubmit,
  };
}
