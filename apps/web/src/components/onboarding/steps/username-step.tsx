/**
 * Username Step
 *
 * Nielsen: Error prevention (validation), Visibility of system status (availability check)
 */

'use client';

import { useAuthSession } from '@profile/api-client';
import { AlertCircle, AtSign, Check, ExternalLink, Loader2, RefreshCw, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HelpTooltip } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';

/**
 * Username validation constants.
 * Server-side validation is authoritative - these exist only for UX feedback.
 */
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const USERNAME_REGEX = /^[a-z0-9_]+$/;

interface ValidationResult {
  valid: boolean;
  message: string;
}

/**
 * Client-side validation for immediate UX feedback.
 * Server validates authoritatively on submit.
 */
function validateUsername(value: string): ValidationResult {
  if (!value) {
    return { valid: false, message: 'Username is required' };
  }
  if (value.length < MIN_LENGTH) {
    return { valid: false, message: `Must be at least ${MIN_LENGTH} characters` };
  }
  if (value.length > MAX_LENGTH) {
    return { valid: false, message: `Must be at most ${MAX_LENGTH} characters` };
  }
  if (!USERNAME_REGEX.test(value)) {
    return {
      valid: false,
      message: 'Only lowercase letters, numbers, and underscores',
    };
  }
  return { valid: true, message: '' };
}

export function UsernameStep() {
  const { username, goToNextStep } = useOnboarding();
  const { data, isLoading } = useAuthSession();
  const isAuthenticated = !!data?.data?.user;

  const [inputValue, setInputValue] = useState(username || '');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);

  // Local validation
  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);

  // Check availability when debounced value changes
  useEffect(() => {
    if (!debouncedUsername || !validation.valid) {
      setIsAvailable(null);
      setApiError(null);
      return;
    }

    // Skip check if it's the same as already saved username
    if (debouncedUsername === username) {
      setIsAvailable(true);
      setApiError(null);
      return;
    }

    // Wait for auth to load
    if (isLoading) {
      return;
    }

    // Must be authenticated (cookie is sent automatically)
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
            headers: {
              Accept: 'application/json',
            },
            credentials: 'include', // Send httpOnly session cookie
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
    // Normalize to lowercase and remove invalid characters
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setInputValue(normalized);
    setIsAvailable(null);
    setApiError(null);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  const handleRetry = () => {
    setApiError(null);
    const current = inputValue;
    setInputValue('');
    setTimeout(() => setInputValue(current), 10);
  };

  const handleNext = useCallback(async () => {
    setTouched(true);

    if (!validation.valid || !isAvailable) {
      return;
    }

    await goToNextStep({ username: inputValue });
  }, [validation.valid, isAvailable, inputValue, goToNextStep]);

  const canProceed = validation.valid && isAvailable === true && !apiError;

  const getStatusIcon = () => {
    if (isLoading || isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
    }
    if (apiError) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
    if (!validation.valid && touched) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    if (isAvailable === true) {
      return <Check className="h-4 w-4 text-emerald-500" />;
    }
    if (isAvailable === false) {
      return <X className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (isLoading) {
      return { text: 'Loading session...', type: 'muted' };
    }
    if (isChecking) {
      return { text: 'Checking availability...', type: 'muted' };
    }
    if (apiError) {
      return { text: apiError, type: 'warning' };
    }
    if (!validation.valid && touched) {
      return { text: validation.message, type: 'error' };
    }
    if (isAvailable === true) {
      return { text: 'Username is available!', type: 'success' };
    }
    if (isAvailable === false) {
      return { text: 'This username is already taken', type: 'error' };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow="Step 2"
        title="Choose your username"
        description="This creates your public profile URL, so keep it simple and memorable."
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
        <div className="flex items-center gap-2 text-sm">
          <ExternalLink className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          <span className="text-zinc-400">profile.app/</span>
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
            onBlur={handleBlur}
            placeholder="johndoe"
            maxLength={MAX_LENGTH}
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              touched && (!validation.valid || isAvailable === false)
                ? 'border-red-500'
                : isAvailable === true
                  ? 'border-emerald-500'
                  : ''
            }`}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">{getStatusIcon()}</div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-1 flex items-center justify-between text-xs ${
              statusMessage.type === 'error'
                ? 'text-red-500'
                : statusMessage.type === 'success'
                  ? 'text-emerald-500'
                  : statusMessage.type === 'warning'
                    ? 'text-amber-500'
                    : 'text-zinc-400'
            }`}
          >
            <p className="flex items-center gap-1">
              {statusMessage.type === 'error' && <AlertCircle className="h-3 w-3" />}
              {statusMessage.type === 'success' && <Check className="h-3 w-3" />}
              {statusMessage.type === 'warning' && <AlertCircle className="h-3 w-3" />}
              {statusMessage.text}
            </p>
            {apiError && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1 text-blue-400 transition-colors hover:text-blue-300"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Character Count */}
        <div className="mt-2 flex justify-end">
          <span className="text-xs text-zinc-500">
            {inputValue.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
        <p className="text-sm font-medium text-white">Username checklist</p>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex items-center gap-2">
            <span className={inputValue.length >= MIN_LENGTH ? 'text-emerald-500' : ''}>
              {inputValue.length >= MIN_LENGTH ? '•' : '–'}
            </span>
            At least {MIN_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span className={inputValue.length <= MAX_LENGTH ? 'text-emerald-500' : ''}>
              {inputValue.length <= MAX_LENGTH ? '•' : '–'}
            </span>
            Maximum {MAX_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span
              className={!inputValue || USERNAME_REGEX.test(inputValue) ? 'text-emerald-500' : ''}
            >
              {!inputValue || USERNAME_REGEX.test(inputValue) ? '•' : '–'}
            </span>
            Letters, numbers, and underscores only
          </li>
          <li className="flex items-center gap-2">
            <span className={isAvailable === true ? 'text-emerald-500' : ''}>
              {isAvailable === true ? '•' : '–'}
            </span>
            Must be unique
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
