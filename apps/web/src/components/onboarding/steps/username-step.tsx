/**
 * Username Step
 *
 * Nielsen: Error prevention (validation), Visibility of system status (availability check)
 */

'use client';

import { Button, HelpTooltip } from '@octopus-synapse/profile-ui';
import {
  isApiError,
  selectEnvelopeData,
  useAuthSession,
  useUsersCheckUsernameAvailability,
} from '@profile/api-client';
import { type DictionaryKey, useI18n } from '@profile/i18n';
import { AlertCircle, AtSign, Check, ExternalLink, Loader2, RefreshCw, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { APP_URL } from '@/config';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';
import { UsernameChecklist } from './username-checklist';
import { normalizeUsername, USERNAME_MAX_LENGTH, validateUsername } from './username-validation';

export function UsernameStep() {
  const { username, goToNextStep, currentStepIndex, allSteps } = useOnboarding();
  const { data, isLoading } = useAuthSession({ query: { select: selectEnvelopeData } });
  const { t } = useI18n();
  const isAuthenticated = !!data?.user;

  const [inputValue, setInputValue] = useState(username || '');
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);
  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);

  const shouldCheck =
    !!debouncedUsername &&
    validation.valid &&
    debouncedUsername !== username &&
    isAuthenticated &&
    !isLoading;

  const availabilityQuery = useUsersCheckUsernameAvailability(
    { username: debouncedUsername || '' },
    {
      query: {
        enabled: shouldCheck,
        retry: false,
      },
    },
  );

  const isChecking = availabilityQuery.isFetching;

  const isAvailable = useMemo(() => {
    if (inputValue !== debouncedUsername) return null;
    if (!debouncedUsername || !validation.valid) return null;
    if (debouncedUsername === username) return true;
    if (!shouldCheck) return null;
    if (availabilityQuery.isSuccess) {
      const responseData = availabilityQuery.data?.data?.data as
        | { available?: boolean }
        | undefined;
      return responseData?.available ?? null;
    }
    return null;
  }, [
    inputValue,
    debouncedUsername,
    validation.valid,
    username,
    shouldCheck,
    availabilityQuery.isSuccess,
    availabilityQuery.data,
  ]);

  const apiError = useMemo(() => {
    if (!isAuthenticated && !isLoading) return t('onboarding.username.notAuthenticated');
    if (inputValue !== debouncedUsername) return null;
    const err = availabilityQuery.error;
    if (!err) return null;
    if (isApiError(err)) {
      const apiErr = err as { statusCode?: number };
      if (apiErr.statusCode === 401) return t('onboarding.username.sessionExpired');
      if (apiErr.statusCode === 429) return t('onboarding.username.tooManyRequests');
      return t('onboarding.username.couldNotVerify');
    }
    return t('onboarding.username.connectionError');
  }, [inputValue, debouncedUsername, availabilityQuery.error, isAuthenticated, isLoading, t]);

  const handleChange = (value: string) => {
    setInputValue(normalizeUsername(value));
  };

  const handleRetry = () => {
    void availabilityQuery.refetch();
  };

  const handleNext = useCallback(async () => {
    setTouched(true);
    if (!validation.valid || !isAvailable) return;
    await goToNextStep({ username: inputValue });
  }, [validation.valid, isAvailable, inputValue, goToNextStep]);

  const canProceed = validation.valid && isAvailable === true && !apiError;

  const statusIcon = getStatusIcon({
    isLoading,
    isChecking,
    apiError,
    validation,
    touched,
    isAvailable,
  });
  const statusMessage = getStatusMessage({
    isLoading,
    isChecking,
    apiError,
    validation,
    touched,
    isAvailable,
    t,
  });

  const appDomain = useMemo(() => {
    try {
      return new URL(APP_URL).host;
    } catch {
      return 'profile.app';
    }
  }, []);

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow={t('onboarding.shell.stepOf', {
          current: currentStepIndex + 1,
          total: allSteps.length,
        })}
        title={t('onboarding.username.title')}
        description={t('onboarding.username.description')}
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          <span className="text-zinc-400">{appDomain}/</span>
          <span className="font-medium text-blue-400">
            {inputValue || t('onboarding.username.preview')}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
        {t('onboarding.username.hint')}
      </div>

      {/* Username Input */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
          <AtSign className="h-4 w-4" strokeWidth={1.5} />
          {t('onboarding.username.label')}
          <span className="text-red-500">*</span>
          <HelpTooltip content={t('onboarding.username.tooltip')} />
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder={t('onboarding.username.placeholder')}
            maxLength={USERNAME_MAX_LENGTH}
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              touched && (!validation.valid || isAvailable === false)
                ? 'border-red-500'
                : isAvailable === true
                  ? 'border-emerald-500'
                  : ''
            }`}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">{statusIcon}</div>
        </div>

        {statusMessage && (
          <StatusMessage message={statusMessage} apiError={apiError} onRetry={handleRetry} />
        )}

        <div className="mt-2 flex justify-end">
          <span className="text-xs text-zinc-500">
            {inputValue.length}/{USERNAME_MAX_LENGTH}
          </span>
        </div>
      </div>

      <UsernameChecklist inputValue={inputValue} isAvailable={isAvailable} />

      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}

// --- Private helpers (collocated for cohesion) ---

interface StatusState {
  isLoading: boolean;
  isChecking: boolean;
  apiError: string | null;
  validation: { valid: boolean; message: string };
  touched: boolean;
  isAvailable: boolean | null;
}

interface StatusMessageData {
  text: string;
  type: 'error' | 'success' | 'warning' | 'muted';
}

function getStatusIcon(s: StatusState) {
  if (s.isLoading || s.isChecking)
    return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
  if (s.apiError) return <AlertCircle className="h-4 w-4 text-amber-500" />;
  if (!s.validation.valid && s.touched) return <X className="h-4 w-4 text-red-500" />;
  if (s.isAvailable === true) return <Check className="h-4 w-4 text-emerald-500" />;
  if (s.isAvailable === false) return <X className="h-4 w-4 text-red-500" />;
  return null;
}

function getStatusMessage(
  s: StatusState & { t: (key: DictionaryKey) => string },
): StatusMessageData | null {
  if (s.isLoading) return { text: s.t('onboarding.username.loadingSession'), type: 'muted' };
  if (s.isChecking) return { text: s.t('onboarding.username.checkingAvailability'), type: 'muted' };
  if (s.apiError) return { text: s.apiError, type: 'warning' };
  if (!s.validation.valid && s.touched) return { text: s.validation.message, type: 'error' };
  if (s.isAvailable === true)
    return { text: s.t('onboarding.username.available'), type: 'success' };
  if (s.isAvailable === false) return { text: s.t('onboarding.username.taken'), type: 'error' };
  return null;
}

const STATUS_COLOR_MAP: Record<StatusMessageData['type'], string> = {
  error: 'text-red-500',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  muted: 'text-zinc-400',
};

function StatusMessage({
  message,
  apiError,
  onRetry,
}: {
  message: StatusMessageData;
  apiError: string | null;
  onRetry: () => void;
}) {
  const { t } = useI18n();
  return (
    <div
      className={`mt-1 flex items-center justify-between text-xs ${STATUS_COLOR_MAP[message.type]}`}
    >
      <p className="flex items-center gap-1">
        {(message.type === 'error' || message.type === 'warning') && (
          <AlertCircle className="h-3 w-3" />
        )}
        {message.type === 'success' && <Check className="h-3 w-3" />}
        {message.text}
      </p>
      {apiError && (
        <Button
          type="button"
          variant="link"
          tone="info"
          size="xs"
          leftIcon={<RefreshCw className="h-3 w-3" />}
          onPress={onRetry}
        >
          {t('onboarding.username.retry')}
        </Button>
      )}
    </div>
  );
}
