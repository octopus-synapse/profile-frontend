/**
 * Protected Dashboard Page
 * Developer-inspired design with code aesthetic
 *
 * TODO: Replace hardcoded placeholder content with real user data.
 * - "Welcome back, developer" → use authenticated user's name
 * - status block (profile/resume/visibility) → fetch from API
 * - Quick stats should reflect actual resume/profile completion state
 */

'use client';

import { useT } from '@profile/i18n';
import { ArrowRight, Code2, FileText, Settings, Terminal, User } from 'lucide-react';
import Link from 'next/link';

export default function ProtectedPage() {
  const t = useT();
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-4 inline-flex items-center gap-2">
          <Code2 className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
          <span className="font-mono text-xs text-zinc-400">
            {'//'} {t('app.dashboard.title')}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          {t('app.dashboard.welcome')}{' '}
          <span className="font-normal text-zinc-400">{t('app.dashboard.developer')}</span>
        </h1>
        <p className="mt-2 font-mono text-sm text-zinc-400">
          <span className="text-pf-success-fg">●</span> {t('app.dashboard.authenticated')}
        </p>
      </div>

      {/* Quick Stats Terminal */}
      <div className="code-block">
        <div className="code-block-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">status.ts</span>
        </div>
        <div className="code-block-content">
          <div>
            <span className="code-keyword">const</span>{' '}
            <span className="code-variable">status</span> = {'{'}
          </div>
          <div className="ml-4">
            <span className="code-function">profile</span>:{' '}
            <span className="code-string">&quot;{t('app.dashboard.status.profile')}&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">resume</span>:{' '}
            <span className="code-string">&quot;{t('app.dashboard.status.resume')}&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">visibility</span>:{' '}
            <span className="code-string">&quot;{t('app.dashboard.status.visibility')}&quot;</span>,
          </div>
          <div>{'}'}</div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          icon={<User className="h-5 w-5" />}
          title={t('app.dashboard.editProfileFn')}
          description={t('app.dashboard.editProfileFnDesc')}
          href="/protected/profile"
        />
        <DashboardCard
          icon={<FileText className="h-5 w-5" />}
          title={t('app.dashboard.manageResumeFn')}
          description={t('app.dashboard.manageResumeFnDesc')}
          href="/protected/resume"
        />
        <DashboardCard
          icon={<Settings className="h-5 w-5" />}
          title={t('app.dashboard.configureFn')}
          description={t('app.dashboard.configureFnDesc')}
          href="/protected/settings"
        />
      </div>

      {/* Terminal Hint */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/patch</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{' '}
            <span className="terminal-command">patch --help</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-zinc-400">{t('app.dashboard.terminalHelp')}</div>
            <div className="mt-1 ml-4 text-zinc-400">
              <span className="text-code-function">edit</span> - {t('app.dashboard.helpEdit')}
            </div>
            <div className="ml-4 text-zinc-400">
              <span className="text-code-function">export</span> - {t('app.dashboard.helpExport')}
            </div>
            <div className="ml-4 text-zinc-400">
              <span className="text-code-function">publish</span> - {t('app.dashboard.helpPublish')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

function DashboardCard({ icon, title, description, href }: DashboardCardProps) {
  const t = useT();
  return (
    <Link
      href={href}
      className="group hover:border-pf-border-emphasis flex flex-col border border-white/10 bg-[#0A0A0A]/95 p-6 transition-all"
    >
      <div className="mb-4 flex items-center gap-3 text-zinc-400 transition-colors group-hover:text-white">
        <div className="flex h-8 w-8 items-center justify-center bg-white text-black">{icon}</div>
        <Terminal className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 font-mono text-sm font-semibold text-white">{title}</h3>
      <p className="flex-1 text-sm text-zinc-400">{description}</p>
      <div className="mt-4 flex items-center font-mono text-xs text-zinc-400 transition-colors group-hover:text-white">
        <span>{t('app.dashboard.execute')}</span>
        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
