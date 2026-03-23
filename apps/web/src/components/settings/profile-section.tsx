/**
 * Profile Section
 * Edit user profile information
 */

'use client';

import {
  AlertCircle,
  Check,
  Github,
  Globe,
  Linkedin,
  Loader2,
  MapPin,
  Phone,
  Save,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { HelpTooltip } from '@/shared/components/ui';
import { showToast } from '@/shared/components/ui/toast';
import { useI18n } from '@profile/i18n';
import { useProfile, useUpdateProfile } from './hooks';
import type { UpdateProfilePayload } from './types';
import { UsernameField } from './username-field';

export function ProfileSection() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const updateProfile = useUpdateProfile();
  const { t } = useI18n();

  const [formData, setFormData] = useState<UpdateProfilePayload>({
    displayName: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      queueMicrotask(() => {
        setFormData({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          location: profile.location || '',
          phone: profile.phone || '',
          website: profile.website || '',
          linkedin: profile.linkedin || '',
          github: profile.github || '',
        });
      });
    }
  }, [profile]);

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsDirty(false);
    } catch (error) {
      showToast.error(t('settings.profile.failedUpdate'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">{t('settings.profile.failedLoad')}</h3>
        <p className="text-sm text-zinc-400 max-w-md">
          {error instanceof Error
            ? error.message
            : t('settings.profile.unexpectedError')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{t('settings.profile.title')}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {t('settings.profile.description')}
          </p>
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            {t('settings.profile.saveChanges')}
          </button>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <UsernameField />
      </div>

      {/* Identity & Contact */}
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            {t('settings.profile.displayName')}
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange('displayName', e.target.value)}
            placeholder={t('settings.profile.displayNamePlaceholder')}
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            {t('settings.profile.bio')}
            <span className="ml-auto text-xs font-normal text-zinc-500">
              {formData.bio?.length ?? 0}/300
            </span>
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => {
              if (e.target.value.length <= 300) handleChange('bio', e.target.value);
            }}
            placeholder={t('settings.profile.bioPlaceholder')}
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              {t('settings.profile.location')}
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder={t('settings.profile.locationPlaceholder')}
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Phone className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              {t('settings.profile.phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Globe className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            {t('settings.profile.website')}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://yoursite.com"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Linkedin className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              {t('settings.profile.linkedin')}
              <HelpTooltip content={t('settings.profile.linkedinTooltip')} />
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Github className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              {t('settings.profile.github')}
              <HelpTooltip content={t('settings.profile.githubTooltip')} />
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      {updateProfile.isSuccess && !isDirty && (
        <div className="flex items-center gap-2 text-sm text-emerald-500">
          <Check className="h-4 w-4" />
          {t('settings.profile.savedSuccess')}
        </div>
      )}

      {updateProfile.isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {t('settings.profile.failedSave')}
        </div>
      )}
    </div>
  );
}
