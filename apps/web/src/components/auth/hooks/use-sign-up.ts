'use client';

/**
 * useSignUp — Sign up form state and submit logic
 * Uses generated TanStack Query mutation for optimized caching and state management
 * NOTE: Signup now returns tokens directly, eliminating the need for a separate login call
 */

import {
  getAuthSessionQueryKey,
  useAccountsSignup,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';

export function useSignUp() {
  const t = useT();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { classifyError } = useErrorHandler();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getErrorMessage = useCallback(
    (err: unknown): string => {
      const classified = classifyError(err);
      if (classified.category === 'conflict') return t('auth.error.emailExists');
      if (classified.category === 'validation') return classified.message;
      if (classified.category === 'network') return t('error.network');
      return classified.message;
    },
    [classifyError, t]
  );

  const validateForm = useCallback((): string | null => {
    if (password !== confirmPassword) return t('auth.error.passwordMismatch');
    if (password.length < 8) return t('auth.error.weakPassword');
    return null;
  }, [password, confirmPassword, t]);

  const signupMutation = useAccountsSignup({
    mutation: {
      onSuccess: async (response) => {
        setErrorMessage(null);
        // Signup now returns tokens directly - no need for separate login
        if (response.status === 201) {
          await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
          // Use Next.js router for client-side navigation (much faster than full page reload)
          router.push(ROUTES.ONBOARDING);
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

      const formError = validateForm();
      if (formError) {
        setErrorMessage(formError);
        return;
      }

      signupMutation.mutate({ data: { email, password, name } });
    },
    [signupMutation, email, password, name, validateForm]
  );

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error: errorMessage,
    isLoading: signupMutation.isPending,
    handleSubmit,
  };
}
