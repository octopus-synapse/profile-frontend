/**
 * Settings Page
 * Backend-driven navigation — section types come from the API.
 * Follows Nielsen heuristics: visibility, user language, consistency.
 */

'use client';

import { type DictionaryKey, useI18n } from '@profile/i18n';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileText,
  Loader2,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GenericSectionEditor } from '@/components/resume/generic';
import { DangerZone } from './account/danger-zone';
import { useCurrentResumeId } from './hooks/use-current-resume-id';
import { PreferencesSection } from './preferences-section';
import { ProfileSection } from './profile-section';
import { ResumeBasicsSection } from './resume-basics-section';
import { genericSectionsRepository } from './services/generic-sections-repository';
import { buildDynamicSettingsNavItems } from './settings-page.utils';
import { SectionIcon } from '@/shared/components/section-icon';
import { TwoFactorSettings } from './two-factor-settings';

type StaticTab = 'resume' | 'profile' | 'preferences' | 'account';
type ActiveTab = StaticTab | string;

const STATIC_TABS: { id: StaticTab; labelKey: DictionaryKey; icon: typeof FileText }[] = [
  { id: 'resume', labelKey: 'app.settings.tabs.resume', icon: FileText },
  { id: 'profile', labelKey: 'app.settings.tabs.profile', icon: User },
  { id: 'preferences', labelKey: 'app.settings.tabs.preferences', icon: Settings },
  { id: 'account', labelKey: 'app.settings.tabs.account', icon: ShieldCheck },
];

export function SettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>('resume');

  const { data: resumeId, isLoading: isLoadingResumeId } = useCurrentResumeId();

  const { data: sectionTypes = [], isLoading: isLoadingSectionTypes } = useQuery({
    queryKey: ['settings-section-types'],
    queryFn: () => genericSectionsRepository.getSectionTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: sections = [], isLoading: isLoadingSections } = useQuery({
    queryKey: ['settings-sections', resumeId],
    queryFn: () => genericSectionsRepository.getAllSections(resumeId),
    enabled: !!resumeId,
    staleTime: 30 * 1000,
  });

  const activeSectionTypes = buildDynamicSettingsNavItems(sectionTypes, sections);
  const isLoadingNavigation =
    isLoadingResumeId || isLoadingSectionTypes || (!!resumeId && isLoadingSections);

  const renderContent = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <ResumeBasicsSection
            dynamicSections={activeSectionTypes}
            onOpenSection={(sectionKey) => setActiveTab(sectionKey)}
          />
        );
      case 'profile':
        return <ProfileSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'account':
        return (
          <div className="space-y-8">
            <TwoFactorSettings />
            <DangerZone />
          </div>
        );
      default: {
        if (!resumeId) {
          return (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          );
        }
        return (
          <GenericSectionEditor key={activeTab} resumeId={resumeId} sectionTypeKey={activeTab} />
        );
      }
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
      <div className="space-y-3">
        <Link
          href="/protected"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          {t('app.settings.backToDashboard')}
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
          {t('app.settings.title')}
        </h1>
        <p className="mt-2 text-base text-zinc-500">{t('app.settings.description')}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-[#0A0A0A]/70 p-4">
          <nav className="space-y-6">
            {/* Resume Essentials */}
            <div className="space-y-1">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {t('app.settings.tabs.resume')}
              </p>
              {STATIC_TABS.filter((tab) => tab.id === 'resume').map(
                ({ id, labelKey, icon: Icon }) => (
                  <SettingsNavButton
                    key={id}
                    label={t(labelKey)}
                    icon={<Icon className="h-4 w-4" strokeWidth={1.5} />}
                    active={activeTab === id}
                    onClick={() => setActiveTab(id)}
                  />
                ),
              )}
            </div>

            {/* Resume Sections - dynamic from backend */}
            {activeSectionTypes.length > 0 && (
              <div className="space-y-1">
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                  {t('settings.nav.sections')}
                </p>
                {isLoadingNavigation ? (
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  activeSectionTypes.map((section) => {
                    return (
                      <SettingsNavButton
                        key={section.key}
                        label={section.label}
                        icon={<SectionIcon iconType={section.iconType} icon={section.icon} size={16} />}
                        active={activeTab === section.key}
                        badge={section.count > 0 ? String(section.count) : undefined}
                        onClick={() => setActiveTab(section.key)}
                      />
                    );
                  })
                )}
              </div>
            )}

            {/* Account */}
            <div className="space-y-1">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                {t('settings.nav.account')}
              </p>
              {STATIC_TABS.filter((tab) => tab.id !== 'resume').map(
                ({ id, labelKey, icon: Icon }) => (
                  <SettingsNavButton
                    key={id}
                    label={t(labelKey)}
                    icon={<Icon className="h-4 w-4" strokeWidth={1.5} />}
                    active={activeTab === id}
                    onClick={() => setActiveTab(id)}
                  />
                ),
              )}
            </div>
          </nav>
        </aside>

        <div className="min-h-[400px] rounded-2xl border border-white/10 bg-[#050505]/70 p-6 md:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function SettingsNavButton({
  label,
  icon,
  badge,
  active,
  onClick,
}: {
  label: string;
  icon?: React.ReactNode;
  badge?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-3 text-left text-sm transition-colors ${
        active
          ? 'border-blue-500/40 bg-blue-500/10 text-white'
          : 'border-transparent bg-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </span>
      {badge ? (
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-300">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
