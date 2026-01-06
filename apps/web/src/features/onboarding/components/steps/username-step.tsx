/**
 * Username Step
 *
 * Nielsen: Error prevention (validation), Visibility of system status (availability check)
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { AtSign, Check, X, Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { HelpTooltip } from "@/shared/components/ui";
import { UsernameSchema } from "@octopus-synapse/profile-contracts";

/** UI constants - must match UsernameSchema constraints */
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;
const USERNAME_REGEX = /^[a-z0-9_]+$/;

interface ValidationResult {
  valid: boolean;
  message: string;
}

function validateUsername(value: string): ValidationResult {
  if (!value) {
    return { valid: false, message: "Username is required" };
  }
  const result = UsernameSchema.safeParse(value);
  if (result.success) {
    return { valid: true, message: "" };
  }
  return { valid: false, message: result.error.errors[0]?.message ?? "Invalid username" };
}

export function UsernameStep() {
  const { username, setUsername, goToNextStep, markStepComplete } = useOnboardingStore();
  const { data: session, status: sessionStatus } = useSession();

  const [inputValue, setInputValue] = useState(username || "");
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

    // Wait for session to load
    if (sessionStatus === "loading") {
      return;
    }

    // Check if we have a token
    if (!session?.accessToken) {
      setApiError("Not authenticated. Please sign in again.");
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      setApiError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/username/check?username=${encodeURIComponent(debouncedUsername)}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setApiError("Session expired. Please refresh the page.");
          } else if (response.status === 429) {
            setApiError("Too many requests. Wait a moment.");
          } else {
            setApiError("Could not verify. Try again.");
          }
          setIsAvailable(null);
          return;
        }

        const result = await response.json();
        setIsAvailable(result.available);
      } catch {
        setApiError("Connection error. Check your internet.");
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername, validation.valid, username, session?.accessToken, sessionStatus]);

  const handleChange = (value: string) => {
    // Normalize to lowercase and remove invalid characters
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
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
    setInputValue("");
    setTimeout(() => setInputValue(current), 10);
  };

  const handleNext = () => {
    setTouched(true);

    if (!validation.valid || !isAvailable) {
      return;
    }

    setUsername(inputValue);
    markStepComplete("username");
    goToNextStep();
  };

  const canProceed = validation.valid && isAvailable === true && !apiError;

  const getStatusIcon = () => {
    if (sessionStatus === "loading" || isChecking) {
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
    if (sessionStatus === "loading") {
      return { text: "Loading session...", type: "muted" };
    }
    if (isChecking) {
      return { text: "Checking availability...", type: "muted" };
    }
    if (apiError) {
      return { text: apiError, type: "warning" };
    }
    if (!validation.valid && touched) {
      return { text: validation.message, type: "error" };
    }
    if (isAvailable === true) {
      return { text: "Username is available!", type: "success" };
    }
    if (isAvailable === false) {
      return { text: "This username is already taken", type: "error" };
    }
    return null;
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Choose Your Username</h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">This will be your public profile URL</p>
      </div>

      {/* URL Preview */}
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 font-mono text-sm">
          <ExternalLink className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
          <span className="text-zinc-400">profile.app/</span>
          <span className="font-medium text-cyan-400">{inputValue || "username"}</span>
        </div>
      </div>

      {/* Code Comment */}
      <div className="font-mono text-xs text-zinc-500">
        <span className="text-gray-500">
          <span className="opacity-60">{"//"}</span> Letters, numbers, and underscores only (3-30
          chars)
        </span>
      </div>

      {/* Username Input */}
      <div>
        <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
          <AtSign className="h-4 w-4" strokeWidth={1.5} />
          username<span className="text-red-500">*</span>
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
            className={`w-full border border-white/10 bg-white/5 px-3 py-2 pr-10 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none ${
              touched && (!validation.valid || isAvailable === false)
                ? "border-red-500"
                : isAvailable === true
                  ? "border-emerald-500"
                  : ""
            }`}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2">{getStatusIcon()}</div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-1 flex items-center justify-between font-mono text-xs ${
              statusMessage.type === "error"
                ? "text-red-500"
                : statusMessage.type === "success"
                  ? "text-emerald-500"
                  : statusMessage.type === "warning"
                    ? "text-amber-500"
                    : "text-zinc-400"
            }`}
          >
            <p className="flex items-center gap-1">
              {statusMessage.type === "error" && <AlertCircle className="h-3 w-3" />}
              {statusMessage.type === "success" && <Check className="h-3 w-3" />}
              {statusMessage.type === "warning" && <AlertCircle className="h-3 w-3" />}
              {statusMessage.text}
            </p>
            {apiError && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-1 text-cyan-400 transition-colors hover:text-cyan-300"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Character Count */}
        <div className="mt-2 flex justify-end">
          <span className="font-mono text-xs text-zinc-500">
            {inputValue.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Rules */}
      <div className="space-y-1 border border-white/10 bg-white/5 p-3">
        <p className="font-mono text-xs font-medium text-zinc-400">{"//"} Username rules:</p>
        <ul className="space-y-1 font-mono text-xs text-zinc-500">
          <li className="flex items-center gap-2">
            <span className={inputValue.length >= MIN_LENGTH ? "text-emerald-500" : ""}>
              {inputValue.length >= MIN_LENGTH ? "+" : "-"}
            </span>
            At least {MIN_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span className={inputValue.length <= MAX_LENGTH ? "text-emerald-500" : ""}>
              {inputValue.length <= MAX_LENGTH ? "+" : "-"}
            </span>
            Maximum {MAX_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span
              className={!inputValue || USERNAME_REGEX.test(inputValue) ? "text-emerald-500" : ""}
            >
              {!inputValue || USERNAME_REGEX.test(inputValue) ? "+" : "-"}
            </span>
            Letters, numbers, and underscores only
          </li>
          <li className="flex items-center gap-2">
            <span className={isAvailable === true ? "text-emerald-500" : ""}>
              {isAvailable === true ? "+" : "-"}
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
