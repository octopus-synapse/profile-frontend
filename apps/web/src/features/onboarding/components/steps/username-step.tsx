/**
 * Username Step
 *
 * Nielsen: Error prevention (validation), Visibility of system status (availability check)
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { AtSign, Check, X, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { apiClient } from "@/shared/lib/api-client";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const MIN_LENGTH = 3;
const MAX_LENGTH = 30;

interface ValidationResult {
  valid: boolean;
  message: string;
}

function validateUsername(value: string): ValidationResult {
  if (!value) {
    return { valid: false, message: "Username is required" };
  }
  if (value.length < MIN_LENGTH) {
    return { valid: false, message: `At least ${MIN_LENGTH} characters` };
  }
  if (value.length > MAX_LENGTH) {
    return { valid: false, message: `Maximum ${MAX_LENGTH} characters` };
  }
  if (!USERNAME_REGEX.test(value)) {
    return { valid: false, message: "Only letters, numbers, and underscores" };
  }
  return { valid: true, message: "" };
}

export function UsernameStep() {
  const { username, setUsername, goToNextStep, markStepComplete } = useOnboardingStore();

  const [inputValue, setInputValue] = useState(username || "");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [touched, setTouched] = useState(false);

  const debouncedUsername = useDebounce(inputValue, 500);

  // Local validation
  const validation = useMemo(() => validateUsername(inputValue), [inputValue]);

  // Check availability when debounced value changes
  useEffect(() => {
    if (!debouncedUsername || !validation.valid) {
      setIsAvailable(null);
      return;
    }

    const checkAvailability = async () => {
      setIsChecking(true);
      try {
        const result = await apiClient.users.checkUsername(debouncedUsername);
        setIsAvailable(result.available);
      } catch {
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedUsername, validation.valid]);

  const handleChange = (value: string) => {
    // Normalize to lowercase and remove invalid characters
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setInputValue(normalized);
    setIsAvailable(null);
  };

  const handleBlur = () => {
    setTouched(true);
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

  const canProceed = validation.valid && isAvailable === true;

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-pf-fg-muted" />;
    }
    if (!validation.valid && touched) {
      return <X className="h-4 w-4 text-pf-danger-fg" />;
    }
    if (isAvailable === true) {
      return <Check className="h-4 w-4 text-pf-success-fg" />;
    }
    if (isAvailable === false) {
      return <X className="h-4 w-4 text-pf-danger-fg" />;
    }
    return null;
  };

  const getStatusMessage = () => {
    if (isChecking) {
      return { text: "Checking availability...", type: "muted" };
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
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Choose Your Username</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          This will be your public profile URL
        </p>
      </div>

      {/* URL Preview */}
      <div className="bg-pf-canvas-subtle border-pf-border-default border p-4">
        <div className="flex items-center gap-2 font-mono text-sm">
          <ExternalLink className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
          <span className="text-pf-fg-muted">profile.app/</span>
          <span className="text-pf-accent-fg font-medium">
            {inputValue || "username"}
          </span>
        </div>
      </div>

      {/* Code Comment */}
      <div className="text-pf-fg-subtle font-mono text-xs">
        <span className="text-gray-500">
          <span className="opacity-60">{"//"}</span> Letters, numbers, and underscores only (3-30 chars)
        </span>
      </div>

      {/* Username Input */}
      <div>
        <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
          <AtSign className="h-4 w-4" strokeWidth={1.5} />
          username<span className="text-pf-danger-fg">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder="johndoe"
            maxLength={MAX_LENGTH}
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 pr-10 font-mono text-sm focus:outline-none ${
              touched && (!validation.valid || isAvailable === false)
                ? "border-pf-danger-fg"
                : isAvailable === true
                  ? "border-pf-success-fg"
                  : ""
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {getStatusIcon()}
          </div>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <p
            className={`mt-1 flex items-center gap-1 font-mono text-xs ${
              statusMessage.type === "error"
                ? "text-pf-danger-fg"
                : statusMessage.type === "success"
                  ? "text-pf-success-fg"
                  : "text-pf-fg-muted"
            }`}
          >
            {statusMessage.type === "error" && <AlertCircle className="h-3 w-3" />}
            {statusMessage.type === "success" && <Check className="h-3 w-3" />}
            {statusMessage.text}
          </p>
        )}

        {/* Character Count */}
        <div className="mt-2 flex justify-end">
          <span className="text-pf-fg-subtle font-mono text-xs">
            {inputValue.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-pf-canvas-inset border-pf-border-muted space-y-1 border p-3">
        <p className="text-pf-fg-muted font-mono text-xs font-medium">// Username rules:</p>
        <ul className="space-y-1 font-mono text-xs text-pf-fg-subtle">
          <li className="flex items-center gap-2">
            <span className={inputValue.length >= MIN_LENGTH ? "text-pf-success-fg" : ""}>
              {inputValue.length >= MIN_LENGTH ? "+" : "-"}
            </span>
            At least {MIN_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span className={inputValue.length <= MAX_LENGTH ? "text-pf-success-fg" : ""}>
              {inputValue.length <= MAX_LENGTH ? "+" : "-"}
            </span>
            Maximum {MAX_LENGTH} characters
          </li>
          <li className="flex items-center gap-2">
            <span className={!inputValue || USERNAME_REGEX.test(inputValue) ? "text-pf-success-fg" : ""}>
              {!inputValue || USERNAME_REGEX.test(inputValue) ? "+" : "-"}
            </span>
            Letters, numbers, and underscores only
          </li>
          <li className="flex items-center gap-2">
            <span className={isAvailable === true ? "text-pf-success-fg" : ""}>
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
