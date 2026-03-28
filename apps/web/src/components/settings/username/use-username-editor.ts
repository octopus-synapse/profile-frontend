/**
 * useUsernameEditor - manages username editing state and availability checks.
 * Uses SDK hooks directly - no manual repositories.
 */

import { useUsersCheckUsernameAvailability } from '@profile/api-client';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { validateUsername } from '../username-field.utils';

interface Profile {
  username?: string | null;
  usernameUpdatedAt?: string | Date | null;
}

export function useUsernameEditor(profile: Profile | null | undefined) {
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);

  useEffect(() => {
    if (profile?.username) {
      setInputValue(profile.username);
    }
  }, [profile?.username]);

  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);
  const hasChanged = inputValue !== profile?.username;

  // Use SDK hook for availability check
  const shouldCheck = isEditing && hasChanged && validation.valid && debouncedUsername.length >= 3;
  const availabilityQuery = useUsersCheckUsernameAvailability(
    { username: debouncedUsername },
    {
      query: {
        enabled: shouldCheck,
        staleTime: 30 * 1000,
      },
    },
  );

  const isChecking = availabilityQuery.isFetching;
  const isAvailable = shouldCheck
    ? ((availabilityQuery.data?.data?.data?.available as boolean | undefined) ?? null)
    : null;

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setInputValue(normalized);
  };

  const startEditing = () => {
    setIsEditing(true);
    setTouched(false);
  };

  const cancelEditing = () => {
    setInputValue(profile?.username || '');
    setIsEditing(false);
    setTouched(false);
  };

  const markTouched = () => setTouched(true);

  const resetEditing = () => {
    setIsEditing(false);
    setTouched(false);
  };

  return {
    inputValue,
    isEditing,
    isChecking,
    isAvailable,
    touched,
    hasChanged,
    validation,
    handleChange,
    startEditing,
    cancelEditing,
    markTouched,
    resetEditing,
  };
}
