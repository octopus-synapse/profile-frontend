/**
 * Personal Info Step
 *
 * Nielsen: Error prevention (validation), Help users recognize errors
 */

'use client';

import { useI18n } from '@profile/i18n';
import { AlertCircle, Mail, MapPin, Phone, User } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { PhoneInput } from '@/shared/components/ui';
import { type PersonalInfo, useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';

/**
 * Validation constants for UX feedback.
 * Server-side validation is authoritative.
 */
const FULL_NAME_MIN = 2;
const FULL_NAME_MAX = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;
const LOCATION_MAX = 100;

interface ValidationResult {
  valid: boolean;
  message: string;
}

function validateFullName(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Name is required' };
  if (value.length < FULL_NAME_MIN)
    return {
      valid: false,
      message: `Must be at least ${FULL_NAME_MIN} characters`,
    };
  if (value.length > FULL_NAME_MAX)
    return {
      valid: false,
      message: `Must be at most ${FULL_NAME_MAX} characters`,
    };
  return { valid: true, message: '' };
}

function validateEmail(value: string): ValidationResult {
  if (!value) return { valid: false, message: 'Email is required' };
  if (!EMAIL_REGEX.test(value)) return { valid: false, message: 'Invalid email format' };
  return { valid: true, message: '' };
}

function validatePhone(value: string): ValidationResult {
  if (!value) return { valid: true, message: '' }; // Optional
  if (!PHONE_REGEX.test(value)) return { valid: false, message: 'Invalid phone format' };
  return { valid: true, message: '' };
}

function validateLocation(value: string): ValidationResult {
  if (!value) return { valid: true, message: '' }; // Optional
  if (value.length > LOCATION_MAX)
    return {
      valid: false,
      message: `Must be at most ${LOCATION_MAX} characters`,
    };
  return { valid: true, message: '' };
}

export function PersonalInfoStep() {
  const { personalInfo, goToNextStep, currentStepIndex, allSteps } = useOnboarding();

  const { language } = useI18n();
  const phoneCountryFormat = language === 'pt-BR' ? 'BR' : 'US';

  const [formData, setFormData] = useState({
    fullName: personalInfo?.fullName || '',
    email: personalInfo?.email || '',
    phone: personalInfo?.phone || '',
    location: personalInfo?.location || '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Client-side validation for UX feedback
  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.fullName) {
      const result = validateFullName(formData.fullName);
      if (!result.valid) newErrors.fullName = result.message;
    }

    if (touched.email) {
      const result = validateEmail(formData.email);
      if (!result.valid) newErrors.email = result.message;
    }

    if (touched.phone && formData.phone) {
      const result = validatePhone(formData.phone);
      if (!result.valid) newErrors.phone = result.message;
    }

    if (touched.location && formData.location) {
      const result = validateLocation(formData.location);
      if (!result.valid) newErrors.location = result.message;
    }

    return newErrors;
  }, [formData, touched]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = useCallback(async () => {
    // Touch all fields to show errors
    setTouched({ fullName: true, email: true, phone: true, location: true });

    // Validate all fields
    const nameResult = validateFullName(formData.fullName);
    const emailResult = validateEmail(formData.email);
    const phoneResult = validatePhone(formData.phone);
    const locationResult = validateLocation(formData.location);

    if (!nameResult.valid || !emailResult.valid || !phoneResult.valid || !locationResult.valid) {
      return;
    }

    const data: PersonalInfo = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      location: formData.location || undefined,
    };
    await goToNextStep({ personalInfo: data });
  }, [formData, goToNextStep]);

  const canProceed = useMemo(() => {
    const nameResult = validateFullName(formData.fullName);
    const emailResult = validateEmail(formData.email);
    return nameResult.valid && emailResult.valid;
  }, [formData.fullName, formData.email]);

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow={`Step ${currentStepIndex + 1} of ${allSteps.length}`}
        title="Personal information"
        description="Add the core details recruiters need to identify and contact you."
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
        Required fields are marked with <span className="font-medium text-white">*</span>.
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <User className="h-4 w-4" strokeWidth={1.5} />
            Full name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            placeholder="John Doe"
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.fullName ? 'border-red-500' : ''} `}
          />
          {errors.fullName && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="dev@example.com"
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.email ? 'border-red-500' : ''} `}
          />
          {errors.email && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            Phone<span className="ml-1 text-xs font-normal text-zinc-500">(optional)</span>
          </label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            countryFormat={phoneCountryFormat as 'BR' | 'US' | 'auto'}
            className="bg-white/5"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            Location<span className="ml-1 text-xs font-normal text-zinc-500">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="São Paulo, BR"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
