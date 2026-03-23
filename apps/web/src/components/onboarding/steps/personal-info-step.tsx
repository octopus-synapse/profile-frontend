/**
 * Personal Info Step
 *
 * Nielsen: Error prevention (validation), Help users recognize errors
 */

'use client';

import { useI18n, type DictionaryKey } from '@profile/i18n';
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

type TranslateFn = (key: DictionaryKey, params?: Record<string, string | number>) => string;

function validateFullName(value: string, t: TranslateFn): ValidationResult {
  if (!value) return { valid: false, message: t('onboarding.personalInfo.nameRequired') };
  if (value.length < FULL_NAME_MIN)
    return {
      valid: false,
      message: t('onboarding.personalInfo.minChars', { min: FULL_NAME_MIN }),
    };
  if (value.length > FULL_NAME_MAX)
    return {
      valid: false,
      message: t('onboarding.personalInfo.maxChars', { max: FULL_NAME_MAX }),
    };
  return { valid: true, message: '' };
}

function validateEmail(value: string, t: TranslateFn): ValidationResult {
  if (!value) return { valid: false, message: t('onboarding.personalInfo.emailRequired') };
  if (!EMAIL_REGEX.test(value)) return { valid: false, message: t('onboarding.personalInfo.invalidEmail') };
  return { valid: true, message: '' };
}

function validatePhone(value: string, t: TranslateFn): ValidationResult {
  if (!value) return { valid: true, message: '' }; // Optional
  if (!PHONE_REGEX.test(value)) return { valid: false, message: t('onboarding.personalInfo.invalidPhone') };
  return { valid: true, message: '' };
}

function validateLocation(value: string, t: TranslateFn): ValidationResult {
  if (!value) return { valid: true, message: '' }; // Optional
  if (value.length > LOCATION_MAX)
    return {
      valid: false,
      message: t('onboarding.personalInfo.maxChars', { max: LOCATION_MAX }),
    };
  return { valid: true, message: '' };
}

export function PersonalInfoStep() {
  const { personalInfo, goToNextStep, currentStepIndex, allSteps } = useOnboarding();

  const { language, t } = useI18n();
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
      const result = validateFullName(formData.fullName, t);
      if (!result.valid) newErrors.fullName = result.message;
    }

    if (touched.email) {
      const result = validateEmail(formData.email, t);
      if (!result.valid) newErrors.email = result.message;
    }

    if (touched.phone && formData.phone) {
      const result = validatePhone(formData.phone, t);
      if (!result.valid) newErrors.phone = result.message;
    }

    if (touched.location && formData.location) {
      const result = validateLocation(formData.location, t);
      if (!result.valid) newErrors.location = result.message;
    }

    return newErrors;
  }, [formData, touched, t]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = useCallback(async () => {
    // Touch all fields to show errors
    setTouched({ fullName: true, email: true, phone: true, location: true });

    const nameResult = validateFullName(formData.fullName, t);
    const emailResult = validateEmail(formData.email, t);
    const phoneResult = validatePhone(formData.phone, t);
    const locationResult = validateLocation(formData.location, t);

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
  }, [formData, goToNextStep, t]);

  const canProceed = useMemo(() => {
    const nameResult = validateFullName(formData.fullName, t);
    const emailResult = validateEmail(formData.email, t);
    return nameResult.valid && emailResult.valid;
  }, [formData.fullName, formData.email, t]);

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow={t('onboarding.shell.stepOf', { current: currentStepIndex + 1, total: allSteps.length })}
        title={t('onboarding.personalInfo.title')}
        description={t('onboarding.personalInfo.description')}
      />

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
        {t('onboarding.personalInfo.requiredNote')} <span className="font-medium text-white">*</span>.
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <User className="h-4 w-4" strokeWidth={1.5} />
            {t('onboarding.personalInfo.fullNameLabel')}<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            onBlur={() => handleBlur('fullName')}
            placeholder={t('onboarding.personalInfo.fullNamePlaceholder')}
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
            {t('onboarding.personalInfo.emailLabel')}<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder={t('onboarding.personalInfo.emailPlaceholder')}
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
            {t('onboarding.personalInfo.phoneLabel')}<span className="ml-1 text-xs font-normal text-zinc-500">{t('onboarding.personalInfo.optional')}</span>
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
            {t('onboarding.personalInfo.locationLabel')}<span className="ml-1 text-xs font-normal text-zinc-500">{t('onboarding.personalInfo.optional')}</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder={t('onboarding.personalInfo.locationPlaceholder')}
            className="w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
