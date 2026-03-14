/**
 * Username Field Component
 * Edit username with 30-day restriction check
 */

'use client';

import { addDays, formatDistanceToNow, isAfter } from 'date-fns';
import { AlertCircle, AtSign, Calendar, Check, ExternalLink, Loader2, Lock, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { useProfile, useUpdateUsername } from './hooks';
import { profileRepository } from './services/settings-repository';

/**
 * Username validation constants.
 * Server-side validation is authoritative - these exist only for UX feedback.
 */
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const USERNAME_REGEX = /^[a-z0-9_]+$/;
const RESTRICTION_DAYS = 30;

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

function getNextChangeDate(usernameUpdatedAt: string | null): Date | null {
  if (!usernameUpdatedAt) return null;
  return addDays(new Date(usernameUpdatedAt), RESTRICTION_DAYS);
}

function canChangeUsername(usernameUpdatedAt: string | null): boolean {
  const nextDate = getNextChangeDate(usernameUpdatedAt);
  if (!nextDate) return true;
  return isAfter(new Date(), nextDate);
}

export function UsernameField() {
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateUsername = useUpdateUsername();

  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);

  // Initialize input value from profile
  useEffect(() => {
    if (profile?.username) {
      setInputValue(profile.username);
    }
  }, [profile?.username]);

  // Check if user can change username (30-day restriction)
  const isRestricted = !canChangeUsername(profile?.usernameUpdatedAt ?? null);
  const nextChangeDate = getNextChangeDate(profile?.usernameUpdatedAt ?? null);

  // Local validation
  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);

  // Check if username changed from current
  const hasChanged = inputValue !== profile?.username;

  // Check availability when debounced value changes
  useEffect(() => {
    if (!isEditing || !hasChanged || !validation.valid) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const result = await profileRepository.checkUsernameAvailability(debouncedUsername);
        setIsAvailable(result.available);
      } catch {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    void checkAvailability();
  }, [debouncedUsername, validation.valid, isEditing, hasChanged]);

  const handleChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setInputValue(normalized);
    setIsAvailable(null);
  };

  const handleEdit = () => {
    if (!isRestricted) {
      setIsEditing(true);
      setTouched(false);
    }
  };

  const handleCancel = () => {
    setInputValue(profile?.username || '');
    setIsEditing(false);
    setTouched(false);
    setIsAvailable(null);
  };

  const handleSave = async () => {
    setTouched(true);

    if (!validation.valid || !isAvailable || !hasChanged) {
      return;
    }

    try {
      await updateUsername.mutateAsync(inputValue);
      setIsEditing(false);
      setTouched(false);
    } catch (error) {
      console.error('Failed to update username:', error);
    }
  };

  const canSave =
    validation.valid && isAvailable === true && hasChanged && !updateUsername.isPending;

  const getStatusIcon = () => {
    if (!isEditing || !hasChanged) return null;

    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
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
    if (!isEditing || !hasChanged) return null;

    if (isChecking) {
      return { text: 'Checking availability...', type: 'muted' };
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

  if (profileLoading) {
    return (
      <div className="flex items-center gap-2 py-2">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
        <span className="text-sm text-zinc-400">Loading...</span>
      </div>
    );
  }

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-white">
          <AtSign className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          Username
        </label>

        {/* View Profile Link */}
        {profile?.username && (
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-cyan-400 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View public profile
          </a>
        )}
      </div>

      {/* Restriction Warning */}
      {isRestricted && nextChangeDate && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
          <Lock className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-500" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-500">Username change restricted</p>
            <p className="text-xs text-amber-500/80">
              You can change your username again{' '}
              {formatDistanceToNow(nextChangeDate, { addSuffix: true })}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-amber-500/60">
              <Calendar className="h-3 w-3" />
              {nextChangeDate.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Input Field */}
      <div>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleEdit}
            disabled={isRestricted}
            maxLength={MAX_LENGTH}
            placeholder="username"
            className={`w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
              touched && isEditing && (!validation.valid || isAvailable === false)
                ? 'border-red-500'
                : isAvailable === true && isEditing
                  ? 'border-emerald-500'
                  : ''
            }`}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">{getStatusIcon()}</div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <p
            className={`mt-1.5 flex items-center gap-1 text-xs ${
              statusMessage.type === 'error'
                ? 'text-red-500'
                : statusMessage.type === 'success'
                  ? 'text-emerald-500'
                  : 'text-zinc-400'
            }`}
          >
            {statusMessage.type === 'error' && <AlertCircle className="h-3 w-3" />}
            {statusMessage.type === 'success' && <Check className="h-3 w-3" />}
            {statusMessage.text}
          </p>
        )}

        {/* URL Preview */}
        {profile?.username && (
          <p className="mt-2 text-xs text-zinc-400">
            Your profile URL:{' '}
            <span className="text-white">profile.app/{inputValue || profile.username}</span>
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {isEditing && hasChanged && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={!canSave}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateUsername.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={updateUsername.isPending}
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Update Error */}
      {updateUsername.isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Failed to update username. Please try again.
        </div>
      )}
    </div>
  );
}
