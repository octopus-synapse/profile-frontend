/**
 * Preferences Section — Minimal design
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import {
  customFetch,
  getUsersGetFullPreferencesQueryKey,
  getUsersUpdateFullPreferencesUrl,
  useUsersGetFullPreferences,
} from '@profile/api-client';
import { type Locale, type LocaleInfo, useI18n } from '@profile/i18n';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2 } from 'lucide-react';
import { useCallback } from 'react';

export function PreferencesSection() {
  const queryClient = useQueryClient();
  const { t, language, setLanguage, locales } = useI18n();

  const preferencesQuery = useUsersGetFullPreferences();
  const preferencesData = preferencesQuery.data?.data?.data as
    | { preferences?: Record<string, unknown> }
    | undefined;
  const preferences = preferencesData?.preferences;
  const isLoading = preferencesQuery.isLoading;

  const updatePreferences = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await customFetch(getUsersUpdateFullPreferencesUrl(), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // Check if response indicates failure
      if (response && typeof response === 'object' && 'success' in response && !response.success) {
        throw new Error((response as { message?: string }).message ?? 'Update failed');
      }
      return response;
    },
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: getUsersGetFullPreferencesQueryKey() });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(getUsersGetFullPreferencesQueryKey());

      // Optimistically update - correct structure: data.data.data.preferences
      queryClient.setQueryData(getUsersGetFullPreferencesQueryKey(), (old: unknown) => {
        if (!old || typeof old !== 'object') return old;
        const oldResponse = old as {
          data?: { data?: { preferences?: Record<string, unknown> } };
        };
        return {
          ...oldResponse,
          data: {
            ...oldResponse.data,
            data: {
              ...oldResponse.data?.data,
              preferences: {
                ...oldResponse.data?.data?.preferences,
                ...newData,
              },
            },
          },
        };
      });

      return { previousData };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(getUsersGetFullPreferencesQueryKey(), context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: getUsersGetFullPreferencesQueryKey() });
    },
  });

  const handleLanguageChange = useCallback(
    (newLocale: Locale) => {
      setLanguage(newLocale);
      updatePreferences.mutate({ language: newLocale });
    },
    [setLanguage, updatePreferences],
  );

  const profileVisibility = (preferences?.profileVisibility as 'public' | 'private') ?? 'private';

  const handleVisibilityChange = (visibility: 'public' | 'private') => {
    updatePreferences.mutate({ profileVisibility: visibility });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-light text-white">{t('settings.preferences.title')}</h2>
        <p className="mt-1 text-[13px] text-zinc-500">{t('settings.preferences.description')}</p>
      </div>

      {/* Visibility */}
      <div className="border-t border-zinc-800/50 pt-8">
        <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {t('settings.preferences.visibility.title')}
        </h3>
        <p className="mb-6 text-[13px] text-zinc-500">
          {t('settings.preferences.visibility.description')}
        </p>

        <div className="flex gap-4">
          <VisibilityOption
            label={t('settings.preferences.visibility.public')}
            description={t('settings.preferences.visibility.publicDesc')}
            selected={profileVisibility === 'public'}
            onClick={() => handleVisibilityChange('public')}
            disabled={updatePreferences.isPending}
          />
          <VisibilityOption
            label={t('settings.preferences.visibility.private')}
            description={t('settings.preferences.visibility.privateDesc')}
            selected={profileVisibility === 'private'}
            onClick={() => handleVisibilityChange('private')}
            disabled={updatePreferences.isPending}
          />
        </div>

        {updatePreferences.isPending && (
          <p className="mt-4 flex items-center gap-2 text-[11px] text-zinc-500">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t('settings.preferences.visibility.updating')}
          </p>
        )}
      </div>

      {/* Language */}
      <div className="border-t border-zinc-800/50 pt-8">
        <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {t('settings.preferences.language.title')}
        </h3>
        <p className="mb-6 text-[13px] text-zinc-500">
          {t('settings.preferences.language.description')}
        </p>

        <div className="flex gap-2">
          {locales.map((locale: LocaleInfo) => (
            <Button
              key={locale.code}
              type="button"
              variant={language === locale.code ? 'solid' : 'ghost'}
              tone="neutral"
              size="sm"
              onPress={() => handleLanguageChange(locale.code)}
            >
              {locale.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisibilityOption({
  label,
  description,
  selected,
  onClick,
  disabled,
}: {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant={selected ? 'soft' : 'outline'}
      tone="neutral"
      size="lg"
      disabled={disabled}
      pressed={selected}
      rightIcon={
        selected ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <Check className="h-3 w-3 text-black" strokeWidth={2.5} />
          </div>
        ) : undefined
      }
      onPress={onClick}
    >
      <div className="flex-1 text-left">
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-[12px] text-zinc-600">{description}</span>
      </div>
    </Button>
  );
}
