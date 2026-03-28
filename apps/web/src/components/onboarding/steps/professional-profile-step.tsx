/**
 * Professional Profile Step
 *
 * Nielsen: Match between system and real world (familiar labels)
 */

'use client';

import { useI18n } from '@profile/i18n';
import { AlertCircle, Briefcase, FileText, Globe, Linkedin } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { type ProfessionalProfile, useGitHubUser, useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';
import { GitHubField } from './professional-profile-github-field';
import {
  extractGitHubUsername,
  normalizeUrl,
  SUMMARY_MAX,
  SUMMARY_MIN,
} from './professional-profile-step.utils';

export function ProfessionalProfileStep() {
  const { professionalProfile, goToNextStep, currentStepIndex, allSteps } = useOnboarding();
  const { t } = useI18n();

  const initialGithub = extractGitHubUsername(professionalProfile?.github ?? '');

  const [formData, setFormData] = useState({
    jobTitle: professionalProfile?.jobTitle || '',
    summary: professionalProfile?.summary || '',
    linkedin: professionalProfile?.linkedin || '',
    github: initialGithub,
    website: professionalProfile?.website || '',
  });

  const {
    user: githubUser,
    isLoading: isGithubLoading,
    error: githubError,
  } = useGitHubUser(formData.github || null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const summaryLength = formData.summary.length;

  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.jobTitle && formData.jobTitle.length < 2) {
      newErrors.jobTitle = t('onboarding.professionalProfile.jobTitleMinLength');
    }

    if (touched.summary) {
      if (summaryLength < SUMMARY_MIN) {
        newErrors.summary = t('onboarding.professionalProfile.summaryMinLength', {
          min: SUMMARY_MIN,
        });
      } else if (summaryLength > SUMMARY_MAX) {
        newErrors.summary = t('onboarding.professionalProfile.summaryMaxLength', {
          max: SUMMARY_MAX,
        });
      }
    }

    const urlFields = ['linkedin', 'website'] as const;
    urlFields.forEach((field) => {
      if (touched[field] && formData[field]) {
        try {
          new URL(formData[field]);
        } catch {
          newErrors[field] = t('onboarding.professionalProfile.invalidUrl');
        }
      }
    });

    if (touched.github && formData.github && githubError && !isGithubLoading) {
      newErrors.github = githubError;
    }

    return newErrors;
  }, [formData, touched, summaryLength, githubError, isGithubLoading, t]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = useCallback(async () => {
    setTouched({
      jobTitle: true,
      summary: true,
      linkedin: true,
      github: true,
      website: true,
    });

    if (
      formData.jobTitle.length < 2 ||
      summaryLength < SUMMARY_MIN ||
      summaryLength > SUMMARY_MAX
    ) {
      return;
    }

    const urlFields = ['linkedin', 'website'] as const;
    const urlErrors: Record<string, string> = {};
    urlFields.forEach((field) => {
      if (formData[field]) {
        try {
          new URL(formData[field]);
        } catch {
          urlErrors[field] = t('onboarding.professionalProfile.invalidUrl');
        }
      }
    });

    if (Object.keys(urlErrors).length > 0) {
      return;
    }

    const githubUrl = formData.github ? `https://github.com/${formData.github.trim()}` : undefined;

    const profile: ProfessionalProfile = {
      jobTitle: formData.jobTitle,
      summary: formData.summary,
      linkedin: normalizeUrl(formData.linkedin),
      github: normalizeUrl(githubUrl),
      website: normalizeUrl(formData.website),
    };
    await goToNextStep({ professionalProfile: profile });
  }, [formData, summaryLength, goToNextStep, t]);

  const canProceed =
    formData.jobTitle.length >= 2 && summaryLength >= SUMMARY_MIN && summaryLength <= SUMMARY_MAX;

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow={t('onboarding.shell.stepOf', {
          current: currentStepIndex + 1,
          total: allSteps.length,
        })}
        title={t('onboarding.professionalProfile.title')}
        description={t('onboarding.professionalProfile.description')}
      />

      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Briefcase className="h-4 w-4" strokeWidth={1.5} />
            {t('onboarding.professionalProfile.jobTitleLabel')}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            onBlur={() => handleBlur('jobTitle')}
            placeholder={t('onboarding.professionalProfile.jobTitlePlaceholder')}
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.jobTitle ? 'border-red-500' : ''} `}
          />
          {errors.jobTitle && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            {t('onboarding.professionalProfile.summaryLabel')}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            onBlur={() => handleBlur('summary')}
            placeholder={t('onboarding.professionalProfile.summaryPlaceholder')}
            rows={4}
            className={`w-full resize-none rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.summary ? 'border-red-500' : ''} `}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.summary ? (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                {errors.summary}
              </p>
            ) : (
              <span className="text-xs text-zinc-500">
                {t('onboarding.professionalProfile.minimumChars', { min: SUMMARY_MIN })}
              </span>
            )}
            <span
              className={`text-xs ${
                summaryLength < SUMMARY_MIN
                  ? 'text-amber-500'
                  : summaryLength > SUMMARY_MAX
                    ? 'text-red-500'
                    : 'text-emerald-500'
              }`}
            >
              {summaryLength}/{SUMMARY_MAX}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
          {t('onboarding.professionalProfile.socialLinksHint')}
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
            {t('onboarding.professionalProfile.linkedinLabel')}
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            onBlur={() => handleBlur('linkedin')}
            placeholder={t('onboarding.professionalProfile.linkedinPlaceholder')}
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.linkedin ? 'border-red-500' : ''} `}
          />
          {errors.linkedin && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.linkedin}
            </p>
          )}
        </div>

        <GitHubField
          value={formData.github}
          onChange={(value) => handleChange('github', value)}
          onBlur={() => handleBlur('github')}
          error={errors.github}
          githubUser={githubUser}
          isGithubLoading={isGithubLoading}
          githubError={githubError}
        />

        {/* Website */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            {t('onboarding.professionalProfile.websiteLabel')}
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            onBlur={() => handleBlur('website')}
            placeholder={t('onboarding.professionalProfile.websitePlaceholder')}
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.website ? 'border-red-500' : ''} `}
          />
          {errors.website && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.website}
            </p>
          )}
        </div>
      </div>

      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
