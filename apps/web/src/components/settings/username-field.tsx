/**
 * UsernameField — edit username with 30-day restriction check.
 */

'use client';

import { showToast } from '@octopus-synapse/profile-ui';
import { useUsersGetProfile, useUsersUpdateUsername } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { AlertCircle, AtSign, ExternalLink, Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { APP_URL } from '@/config';
import { useUsernameEditor } from './username/use-username-editor';
import { UsernameActionButtons } from './username/username-action-buttons';
import { UsernameRestrictionBanner } from './username/username-restriction-banner';
import { getStatusMessage, StatusIcon, StatusMessage } from './username/username-status';
import { canChangeUsername, getNextChangeDate, MAX_LENGTH } from './username-field.utils';

export function UsernameField() {
  const { t } = useI18n();
  const profileQuery = useUsersGetProfile();
  const profile = profileQuery.data?.data?.data?.profile as Record<string, unknown> | undefined;
  const profileLoading = profileQuery.isLoading;
  const updateUsername = useUsersUpdateUsername();
  const editorProfile = profile
    ? {
        username: profile.username as string | null | undefined,
        usernameUpdatedAt: profile.usernameUpdatedAt as string | Date | null | undefined,
      }
    : null;
  const editor = useUsernameEditor(editorProfile);

  const appDomain = useMemo(() => {
    try {
      return new URL(APP_URL).host;
    } catch {
      return 'profile.app';
    }
  }, []);

  const isRestricted = !canChangeUsername((profile?.usernameUpdatedAt as string | null) ?? null);
  const nextChangeDate = getNextChangeDate((profile?.usernameUpdatedAt as string | null) ?? null);

  const handleSave = async () => {
    editor.markTouched();
    if (!editor.validation.valid || !editor.isAvailable || !editor.hasChanged) return;
    try {
      await updateUsername.mutateAsync({ data: { username: editor.inputValue } });
      editor.resetEditing();
    } catch {
      showToast.error(t('settings.username.updateFailed'));
    }
  };

  const handleFocus = () => {
    if (!isRestricted) editor.startEditing();
  };

  const canSave =
    editor.validation.valid &&
    editor.isAvailable === true &&
    editor.hasChanged &&
    !updateUsername.isPending;

  const statusCtx = {
    isEditing: editor.isEditing,
    hasChanged: editor.hasChanged,
    isChecking: editor.isChecking,
    isValid: editor.validation.valid,
    touched: editor.touched,
    validationMessage: editor.validation.message,
    isAvailable: editor.isAvailable,
  };

  if (profileLoading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        <span className="text-sm text-zinc-400">{t('action.loading')}</span>
      </div>
    );
  }

  const inputBorderClass = getBorderClass(
    editor.touched,
    editor.isEditing,
    editor.validation.valid,
    editor.isAvailable,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
          <AtSign className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          {t('settings.username.title')}
        </label>
        {(profile?.username as string | undefined) && (
          <a
            href={`/${profile?.username as string}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            {t('settings.username.viewProfile')}
          </a>
        )}
      </div>

      {isRestricted && nextChangeDate && (
        <UsernameRestrictionBanner nextChangeDate={nextChangeDate} />
      )}

      <div>
        <div className="relative">
          <input
            type="text"
            value={editor.inputValue}
            onChange={(e) => editor.handleChange(e.target.value)}
            onFocus={handleFocus}
            disabled={isRestricted}
            maxLength={MAX_LENGTH}
            placeholder="username"
            className={`w-full rounded-lg border bg-[#0A0A0A]/80 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${inputBorderClass}`}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            <StatusIcon status={statusCtx} />
          </div>
        </div>
        <StatusMessage message={getStatusMessage(statusCtx)} />
        {(profile?.username as string | undefined) && (
          <p className="mt-2 text-xs text-zinc-400">
            Your profile URL:{' '}
            <span className="text-white">
              {appDomain}/{editor.inputValue || (profile?.username as string)}
            </span>
          </p>
        )}
      </div>

      {editor.isEditing && editor.hasChanged && (
        <UsernameActionButtons
          canSave={canSave}
          isPending={updateUsername.isPending}
          onSave={() => void handleSave()}
          onCancel={editor.cancelEditing}
        />
      )}

      {updateUsername.isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          {t('settings.username.updateFailed')}
        </div>
      )}
    </div>
  );
}

function getBorderClass(
  touched: boolean,
  isEditing: boolean,
  isValid: boolean,
  isAvailable: boolean | null,
): string {
  if (touched && isEditing && (!isValid || isAvailable === false)) return 'border-red-500';
  if (isAvailable === true && isEditing) return 'border-emerald-500';
  return 'border-white/10';
}
