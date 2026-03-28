/**
 * ProfileSection — Minimal profile editor
 */

'use client';

import {
  type UpdateUserProfileRequestDto,
  useUsersGetProfile,
  useUsersUpdateProfile,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Check, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { showToast } from '@/shared/components/ui/toast';
import { UsernameField } from './username-field';

export function ProfileSection() {
  const profileQuery = useUsersGetProfile();
  const profile = profileQuery.data?.data?.data?.profile as Record<string, unknown> | undefined;
  const isLoading = profileQuery.isLoading;
  const isError = profileQuery.isError;
  const updateProfileMutation = useUsersUpdateProfile();
  const { t } = useI18n();

  const [formData, setFormData] = useState<UpdateUserProfileRequestDto>({
    name: '',
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
          name: (profile.name as string) || (profile.displayName as string) || '',
          bio: (profile.bio as string) || '',
          location: (profile.location as string) || '',
          phone: (profile.phone as string) || '',
          website: (profile.website as string) || '',
          linkedin: (profile.linkedin as string) || '',
          github: (profile.github as string) || '',
        });
      });
    }
  }, [profile]);

  const handleChange = (field: keyof UpdateUserProfileRequestDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync({ data: formData });
      setIsDirty(false);
    } catch {
      showToast.error(t('settings.profile.failedUpdate'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-zinc-500">{t('settings.profile.failedLoad')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-light text-white">{t('settings.profile.title')}</h2>
          <p className="mt-1 text-[13px] text-zinc-500">{t('settings.profile.description')}</p>
        </div>
        {isDirty && (
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={updateProfileMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>{t('settings.profile.saveChanges')}</span>
          </button>
        )}
      </div>

      {/* Username */}
      <Section>
        <UsernameField />
      </Section>

      {/* Basic Info */}
      <Section title={t('settings.profile.displayName')}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={t('settings.profile.displayName')}
            value={formData.name ?? ''}
            onChange={(v) => handleChange('name', v)}
            placeholder={t('settings.profile.displayNamePlaceholder')}
          />
          <Field
            label={t('settings.profile.location')}
            value={formData.location ?? ''}
            onChange={(v) => handleChange('location', v)}
            placeholder={t('settings.profile.locationPlaceholder')}
          />
        </div>
        <div className="mt-6">
          <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
            {t('settings.profile.bio')}
          </label>
          <textarea
            value={formData.bio ?? ''}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder={t('settings.profile.bioPlaceholder')}
            maxLength={300}
            rows={3}
            className="w-full resize-none bg-transparent text-[15px] text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <div className="mt-1 text-right text-[11px] text-zinc-600">
            {(formData.bio ?? '').length}/300
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={t('settings.profile.phone')}
            value={formData.phone ?? ''}
            onChange={(v) => handleChange('phone', v)}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          <Field
            label={t('settings.profile.website')}
            value={formData.website ?? ''}
            onChange={(v) => handleChange('website', v)}
            placeholder="https://yoursite.com"
            type="url"
          />
        </div>
      </Section>

      {/* Social */}
      <Section title="Social">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field
            label={t('settings.profile.linkedin')}
            value={formData.linkedin ?? ''}
            onChange={(v) => handleChange('linkedin', v)}
            placeholder="linkedin.com/in/username"
            type="url"
          />
          <Field
            label={t('settings.profile.github')}
            value={formData.github ?? ''}
            onChange={(v) => handleChange('github', v)}
            placeholder="github.com/username"
            type="url"
          />
        </div>
      </Section>

      {/* Success message */}
      {updateProfileMutation.isSuccess && !isDirty && (
        <p className="text-[13px] text-emerald-400">{t('settings.profile.savedSuccess')}</p>
      )}
    </div>
  );
}

function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-zinc-800/50 pt-8">
      {title && (
        <h3 className="mb-6 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-zinc-800 bg-transparent py-2 text-[15px] text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
      />
    </div>
  );
}
