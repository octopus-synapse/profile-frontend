/**
 * GitHub username field with live validation and user preview card.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { AlertCircle, Check, ExternalLink, Github, Loader2 } from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
}

interface GitHubFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  githubUser: GitHubUser | null;
  isGithubLoading: boolean;
  githubError: string | null;
}

export function GitHubField({
  value,
  onChange,
  onBlur,
  error,
  githubUser,
  isGithubLoading,
  githubError,
}: GitHubFieldProps) {
  const { t } = useI18n();

  return (
    <div>
      <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-white">
        <Github className="h-4 w-4" strokeWidth={1.5} />
        {t('onboarding.professionalProfile.githubLabel')}
      </label>
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(e) => {
            const sanitized = e.target.value.replace(/[^a-zA-Z0-9_-]/g, '');
            onChange(sanitized);
          }}
          onBlur={onBlur}
          placeholder={t('onboarding.professionalProfile.githubPlaceholder')}
          className={`w-full rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2.5 pr-10 text-sm text-white placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
            error ? 'border-red-500' : githubUser ? 'border-emerald-500' : ''
          }`}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          {isGithubLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
          ) : githubUser ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : githubError && value ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : null}
        </div>
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

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

      {githubError && value && !isGithubLoading && !githubUser && (
        <p className="mt-1 text-xs text-amber-500">{githubError}</p>
      )}

      {!value && !githubError && (
        <p className="mt-1 text-xs text-zinc-500">
          {t('onboarding.professionalProfile.githubHint')}
        </p>
      )}
    </div>
  );
}
