/**
 * Username requirements checklist — visual feedback for each validation rule.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH, USERNAME_REGEX } from './username-validation';

interface UsernameChecklistProps {
  inputValue: string;
  isAvailable: boolean | null;
}

function CheckItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={met ? 'text-emerald-500' : ''}>{met ? '•' : '–'}</span>
      {label}
    </li>
  );
}

export function UsernameChecklist({ inputValue, isAvailable }: UsernameChecklistProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2 rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
      <p className="text-sm font-medium text-white">{t('onboarding.username.checklistTitle')}</p>
      <ul className="space-y-2 text-sm text-zinc-400">
        <CheckItem
          met={inputValue.length >= USERNAME_MIN_LENGTH}
          label={t('onboarding.username.minLength', { min: USERNAME_MIN_LENGTH })}
        />
        <CheckItem
          met={inputValue.length <= USERNAME_MAX_LENGTH}
          label={t('onboarding.username.maxLength', { max: USERNAME_MAX_LENGTH })}
        />
        <CheckItem
          met={!inputValue || USERNAME_REGEX.test(inputValue)}
          label={t('onboarding.username.validChars')}
        />
        <CheckItem met={isAvailable === true} label={t('onboarding.username.mustBeUnique')} />
      </ul>
    </div>
  );
}
