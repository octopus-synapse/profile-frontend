/**
 * Preferences Section
 * Profile visibility and language preferences
 */

'use client';

import { type Locale, type LocaleInfo, useI18n } from '@profile/i18n';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Eye, EyeOff, Globe, Loader2 } from 'lucide-react';
import { useCallback } from 'react';
import { preferencesRepository } from './services/settings-repository';

export function PreferencesSection() {
  const queryClient = useQueryClient();
  const { t, language, setLanguage, locales } = useI18n();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ['preferences', 'full'],
    queryFn: () => preferencesRepository.getFullPreferences(),
  });

  const updatePreferences = useMutation({
    mutationFn: (data: { profileVisibility: 'public' | 'private' }) =>
      preferencesRepository.updateFullPreferences(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  const updateLanguagePreference = useMutation({
    mutationFn: (lang: string) =>
      preferencesRepository.updateFullPreferences({ language: lang }),
  });

  const handleLanguageChange = useCallback(
    (newLocale: Locale) => {
      setLanguage(newLocale);
      updateLanguagePreference.mutate(newLocale);
    },
    [setLanguage, updateLanguagePreference],
  );

  const profileVisibility = preferences?.profileVisibility ?? 'private';

  const handleVisibilityChange = (visibility: 'public' | 'private') => {
    updatePreferences.mutate({ profileVisibility: visibility });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-white">{t('settings.preferences.title')}</h2>
        <p className="mt-1 text-sm text-zinc-400">{t('settings.preferences.description')}</p>
      </div>

      {/* Profile Visibility */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-2 text-sm font-semibold text-white">{t('settings.preferences.visibility.title')}</h3>
        <p className="mb-4 text-sm text-zinc-400">{t('settings.preferences.visibility.description')}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleVisibilityChange('public')}
            disabled={updatePreferences.isPending || isLoading}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
              profileVisibility === 'public'
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-white/10 bg-[#0A0A0A]/80 hover:border-white/20 hover:bg-white/5'
            } ${updatePreferences.isPending ? 'opacity-50' : ''}`}
          >
            <Eye
              className={`h-5 w-5 ${
                profileVisibility === 'public' ? 'text-emerald-400' : 'text-zinc-400'
              }`}
              strokeWidth={1.5}
            />
            <div className="flex-1 text-left">
              <span
                className={`block text-sm font-medium ${
                  profileVisibility === 'public' ? 'text-emerald-400' : 'text-zinc-200'
                }`}
              >
                {t('settings.preferences.visibility.public')}
              </span>
              <span className="text-xs text-zinc-500">{t('settings.preferences.visibility.publicDesc')}</span>
            </div>
            {profileVisibility === 'public' && <Check className="h-4 w-4 text-emerald-400" />}
          </button>
          <button
            type="button"
            onClick={() => handleVisibilityChange('private')}
            disabled={updatePreferences.isPending || isLoading}
            className={`flex items-center gap-3 rounded-xl border p-4 transition-all ${
              profileVisibility === 'private'
                ? 'border-white/30 bg-white/10'
                : 'border-white/10 bg-[#0A0A0A]/80 hover:border-white/20 hover:bg-white/5'
            } ${updatePreferences.isPending ? 'opacity-50' : ''}`}
          >
            <EyeOff
              className={`h-5 w-5 ${
                profileVisibility === 'private' ? 'text-white' : 'text-zinc-400'
              }`}
              strokeWidth={1.5}
            />
            <div className="flex-1 text-left">
              <span
                className={`block text-sm font-medium ${
                  profileVisibility === 'private' ? 'text-white' : 'text-zinc-200'
                }`}
              >
                {t('settings.preferences.visibility.private')}
              </span>
              <span className="text-xs text-zinc-500">{t('settings.preferences.visibility.privateDesc')}</span>
            </div>
            {profileVisibility === 'private' && <Check className="h-4 w-4 text-white" />}
          </button>
        </div>
        {updatePreferences.isPending && (
          <p className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            {t('settings.preferences.visibility.updating')}
          </p>
        )}
      </div>

      {/* Interface Language */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-2 text-sm font-semibold text-white">{t('settings.preferences.language.title')}</h3>
        <p className="mb-4 text-sm text-zinc-400">{t('settings.preferences.language.description')}</p>
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
          <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0A0A0A]/80 p-1">
            {locales.map((locale: LocaleInfo) => (
              <button
                key={locale.code}
                type="button"
                onClick={() => handleLanguageChange(locale.code)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  language === locale.code
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                aria-pressed={language === locale.code}
              >
                {locale.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
