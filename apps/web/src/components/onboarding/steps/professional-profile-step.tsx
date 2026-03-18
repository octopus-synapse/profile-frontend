/**
 * Professional Profile Step
 *
 * Nielsen: Match between system and real world (familiar labels)
 */

'use client';

import {
  AlertCircle,
  Briefcase,
  Check,
  ExternalLink,
  FileText,
  Github,
  Globe,
  Linkedin,
  Loader2,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { type ProfessionalProfile, useGitHubUser, useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';

export function ProfessionalProfileStep() {
  const { professionalProfile, goToNextStep } = useOnboarding();

  // Extract GitHub username from URL if it's a full URL
  const extractGitHubUsername = (url: string | undefined): string => {
    if (!url) return '';
    // If it's already just a username, return it
    if (!url.includes('github.com')) return url.trim();
    // Extract username from URL
    const match = url.match(/github\.com\/([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)/);
    return match?.[1] ?? url.replace(/^https?:\/\/(www\.)?github\.com\//, '').trim();
  };

  const initialGithub: string = extractGitHubUsername(professionalProfile?.github ?? '');

  const [formData, setFormData] = useState({
    jobTitle: professionalProfile?.jobTitle || '',
    summary: professionalProfile?.summary || '',
    linkedin: professionalProfile?.linkedin || '',
    github: initialGithub,
    website: professionalProfile?.website || '',
  });

  // Fetch GitHub user data
  const {
    user: githubUser,
    isLoading: isGithubLoading,
    error: githubError,
  } = useGitHubUser(formData.github || null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Character count for summary
  const summaryLength = formData.summary.length;
  const minSummary = 50;
  const maxSummary = 2000;

  // Validate using useMemo instead of useEffect + setState
  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.jobTitle && formData.jobTitle.length < 2) {
      newErrors.jobTitle = 'Job title must be at least 2 characters';
    }

    if (touched.summary) {
      if (summaryLength < minSummary) {
        newErrors.summary = `Summary must be at least ${minSummary} characters`;
      } else if (summaryLength > maxSummary) {
        newErrors.summary = `Summary must be less than ${maxSummary} characters`;
      }
    }

    // URL validations (only for linkedin and website, github is validated via API)
    const urlFields = ['linkedin', 'website'] as const;
    urlFields.forEach((field) => {
      if (touched[field] && formData[field]) {
        try {
          new URL(formData[field]);
        } catch {
          newErrors[field] = 'Invalid URL format';
        }
      }
    });

    // GitHub validation: show error if user not found
    if (touched.github && formData.github && githubError && !isGithubLoading) {
      newErrors.github = githubError;
    }

    return newErrors;
  }, [formData, touched, summaryLength, githubError, isGithubLoading]);

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

    if (formData.jobTitle.length < 2 || summaryLength < minSummary || summaryLength > maxSummary) {
      return;
    }

    // Validate URLs even if not touched (only linkedin and website)
    const urlFields = ['linkedin', 'website'] as const;
    const urlErrors: Record<string, string> = {};
    urlFields.forEach((field) => {
      if (formData[field]) {
        try {
          new URL(formData[field]);
        } catch {
          urlErrors[field] = 'Invalid URL format';
        }
      }
    });

    if (Object.keys(urlErrors).length > 0) {
      // Show errors but don't prevent proceeding if URLs are optional
      console.warn('URL validation errors:', urlErrors);
    }

    // Normalize empty URLs to undefined
    const normalizeUrl = (url: string | undefined): string | undefined => {
      if (!url || url.trim() === '') return undefined;
      return url;
    };

    // Build GitHub URL from username if provided
    const githubUrl = formData.github ? `https://github.com/${formData.github.trim()}` : undefined;

    const profile: ProfessionalProfile = {
      jobTitle: formData.jobTitle,
      summary: formData.summary,
      linkedin: normalizeUrl(formData.linkedin),
      github: normalizeUrl(githubUrl),
      website: normalizeUrl(formData.website),
    };
    await goToNextStep({ professionalProfile: profile });
  }, [formData, summaryLength, goToNextStep]);

  const canProceed =
    formData.jobTitle.length >= 2 && summaryLength >= minSummary && summaryLength <= maxSummary;

  return (
    <div className="space-y-6">
      <OnboardingStepHeader
        eyebrow="Step 3"
        title="Professional profile"
        description="Summarize your role, your strengths, and the links that support your profile."
      />

      {/* Form */}
      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Briefcase className="h-4 w-4" strokeWidth={1.5} />
            Job title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            onBlur={() => handleBlur('jobTitle')}
            placeholder="Senior Software Engineer"
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
            Summary<span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            onBlur={() => handleBlur('summary')}
            placeholder="Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure..."
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
              <span className="text-xs text-zinc-500">Minimum {minSummary} characters</span>
            )}
            <span
              className={`text-xs ${
                summaryLength < minSummary
                  ? 'text-amber-500'
                  : summaryLength > maxSummary
                    ? 'text-red-500'
                    : 'text-emerald-500'
              }`}
            >
              {summaryLength}/{maxSummary}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm text-zinc-400">
          Social links are optional, but they help make your profile more credible.
        </div>

        {/* LinkedIn */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
            LinkedIn
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            onBlur={() => handleBlur('linkedin')}
            placeholder="https://linkedin.com/in/username"
            className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.linkedin ? 'border-red-500' : ''} `}
          />
          {errors.linkedin && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.linkedin}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Github className="h-4 w-4" strokeWidth={1.5} />
            GitHub
          </label>
          <div className="relative">
            <input
              type="search"
              value={formData.github}
              onChange={(e) => {
                // Only allow alphanumeric, hyphens, and underscores
                const value = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
                handleChange('github', value);
              }}
              onBlur={() => handleBlur('github')}
              placeholder="username"
              className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.github ? 'border-red-500' : githubUser ? 'border-emerald-500' : ''
              }`}
            />
            <div className="absolute top-1/2 right-3 -translate-y-1/2">
              {isGithubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
              ) : githubUser ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : githubError && formData.github ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : null}
            </div>
          </div>
          {errors.github && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
              <AlertCircle className="h-3 w-3" />
              {errors.github}
            </p>
          )}

          {/* GitHub User Preview */}
          {githubUser && !isGithubLoading && (
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-3">
              <img
                src={githubUser.avatar_url}
                alt={githubUser.login}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{githubUser.login}</span>
                  {githubUser.name && (
                    <span className="text-xs text-zinc-400">({githubUser.name})</span>
                  )}
                </div>
                <a
                  href={githubUser.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex items-center gap-1 text-xs text-blue-400 transition-colors hover:text-blue-300"
                >
                  <ExternalLink className="h-3 w-3" />
                  {githubUser.html_url}
                </a>
              </div>
            </div>
          )}

          {/* Non-intrusive error message when user not found */}
          {githubError && formData.github && !isGithubLoading && !githubUser && (
            <p className="mt-1 text-xs text-amber-500">{githubError}</p>
          )}

          {/* Helper text */}
          {!formData.github && !githubError && (
            <p className="mt-1 text-xs text-zinc-500">Digite apenas o username (ex: octocat)</p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            onBlur={() => handleBlur('website')}
            placeholder="https://yoursite.dev"
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

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
