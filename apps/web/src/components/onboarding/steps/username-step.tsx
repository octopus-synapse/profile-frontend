/**
 * Username Step
 *
 * Nielsen: Error prevention (validation), Visibility of system status (availability check)
 */

'use client';

import { useAuthSession } from '@profile/api-client';
import { AlertCircle, AtSign, Check, ExternalLink, Loader2, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { APP_URL } from '@/config';
import { HelpTooltip } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';
import { UsernameChecklist } from './username-checklist';
import {
  USERNAME_MAX_LENGTH,
  normalizeUsername,
  validateUsername,
} from './username-validation';

export function UsernameStep() {
  const { username, goToNextStep, currentStepIndex, allSteps } = useOnboarding();
  const { data, isLoading } = useAuthSession();
  const isAuthenticated = !!data?.data?.user;

  const [inputValue, setInputValue] = useState(username || '');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);
  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);

  // Check availability when debounced value changes
  useEffect(() => {
    if (!debouncedUsername || !validation.valid) {
      setIsAvailable(null);
      setApiError(null);
      return;
    }

    if (debouncedUsername === username) {
      setIsAvailable(true);
      setApiError(null);
      return;
    }

    if (isLoading) return;

    if (!isAuthenticated) {
      setApiError('Not authenticated. Please sign in again.');
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      setApiError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/username/check?username=${encodeURIComponent(debouncedUsername)}`,
          {
            headers: { Accept: 'application/json' },
            credentials: 'include',
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            setApiError('Session expired. Please refresh the page.');
          } else if (response.status === 429) {
            setApiError('Too many requests. Wait a moment.');
          } else {
            setApiError('Could not verify. Try again.');
          }
          setIsAvailable(null);
          return;
        }

        const result = (await response.json()) as {
          success: boolean;
          data: { available: boolean };
        };
        setIsAvailable(result.data.available);
      } catch {
        setApiError('Connection error. Check your internet.');
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    void checkAvailability();
  }, [debouncedUsername, validation.valid, username, isLoading, isAuthenticated]);

  const handleChange = (value: string) => {
    setInputValue(normalizeUsername(value));
    setIsAvailable(null);
    setApiError(null);
  };

  const handleRetry = () => {
    setApiError(null);
    const current = inputValue;
    setInputValue('');
    setTimeout(() => setInputValue(current), 10);
  };

  const handleNext = useCallback(async () => {
    setTouched(true);
    if (!validation.valid || !isAvailable) return;
    await goToNextStep({ username: inputValue });
  }, [validation.valid, isAvailable, inputValue, goToNextStep]);

  const canProceed = validation.valid && isAvailable === true && !apiError;

  const statusIcon = getStatusIcon({ isLoading, isChecking, apiError, validation, touched, isAvailable });
  const statusMessage = getStatusMessage({ isLoading, isChecking, apiError, validation, touched, isAvailable });

  const appDomain = useMemo(() => {
    try { return new URL(APP_URL).host; } catch { return 'profile.app'; }
  }, []);

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow={`Step ${currentStepIndex + 1} of ${allSteps.length}`}
        title="Choose your username"
        description="This creates your public profile URL, so keep it simple and memorable."
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          <span className="text-zinc-400">{appDomain}/</span>
          <span className="font-medium text-blue-400">{inputValue || 'username'}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
        Use 3 to 30 lowercase letters, numbers, or underscores.
      </div>

      {/* Username Input */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
          <AtSign className="h-4 w-4" strokeWidth={1.5} />
          Username<span className="text-red-500">*</span>
          <HelpTooltip content="Your unique identifier on PATCH. This cannot be changed later, so choose wisely!" />
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="johndoe"
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
  if (s.isLoading || s.isChecking) return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
  if (s.apiError) return <AlertCircle className="h-4 w-4 text-amber-500" />;
  if (!s.validation.valid && s.touched) return <X className="h-4 w-4 text-red-500" />;
  if (s.isAvailable === true) return <Check className="h-4 w-4 text-emerald-500" />;
  if (s.isAvailable === false) return <X className="h-4 w-4 text-red-500" />;
  return null;
}

function getStatusMessage(s: StatusState): StatusMessageData | null {
  if (s.isLoading) return { text: 'Loading session...', type: 'muted' };
  if (s.isChecking) return { text: 'Checking availability...', type: 'muted' };
  if (s.apiError) return { text: s.apiError, type: 'warning' };
  if (!s.validation.valid && s.touched) return { text: s.validation.message, type: 'error' };
  if (s.isAvailable === true) return { text: 'Username is available!', type: 'success' };
  if (s.isAvailable === false) return { text: 'This username is already taken', type: 'error' };
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
  return (
    <div className={`mt-1 flex items-center justify-between text-xs ${STATUS_COLOR_MAP[message.type]}`}>
      <p className="flex items-center gap-1">
        {(message.type === 'error' || message.type === 'warning') && <AlertCircle className="h-3 w-3" />}
        {message.type === 'success' && <Check className="h-3 w-3" />}
        {message.text}
      </p>
      {apiError && (
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1 text-blue-400 transition-colors hover:text-blue-300"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      )}
    </div>
  );
}
