/**
 * Settings Page
 * Backend-driven tabs — section types come from the API, not hardcoded config.
 * Profile and Preferences remain static tabs.
 */

'use client';

import { type DictionaryKey, useI18n } from '@profile/i18n';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GenericSectionEditor } from '@/components/resume/generic';
import { useCurrentResumeId } from './hooks/use-current-resume-id';
import { PreferencesSection } from './preferences-section';
import { ProfileSection } from './profile-section';
import { genericSectionsRepository } from './services/generic-sections-repository';

type StaticTab = 'profile' | 'preferences';
type ActiveTab = StaticTab | string; // string = sectionTypeKey for dynamic tabs

const STATIC_TABS: { id: StaticTab; labelKey: DictionaryKey; icon: typeof User }[] = [
  { id: 'profile', labelKey: 'app.settings.tabs.profile', icon: User },
  { id: 'preferences', labelKey: 'app.settings.tabs.preferences', icon: Settings },
];

export function SettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');

  const { data: resumeId } = useCurrentResumeId();

  const { data: sectionTypes = [], isLoading: isLoadingSectionTypes } = useQuery({
    queryKey: ['settings-section-types'],
    queryFn: () => genericSectionsRepository.getSectionTypes(),
    staleTime: 5 * 60 * 1000,
  });

  const activeSectionTypes = sectionTypes.filter((st) => st.isActive);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'preferences':
        return <PreferencesSection />;
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
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      <div>
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

      {/* Tab Navigation */}
      <div className="relative border-b border-white/10">
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[var(--pf-canvas-default)] to-transparent md:hidden" />
        <nav className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
          {/* Static tabs */}
          {STATIC_TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-sm whitespace-nowrap transition-colors focus-visible:outline-none ${
                activeTab === id
                  ? 'border-cyan-500 text-white'
                  : 'border-transparent text-zinc-500 hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {t(labelKey)}
            </button>
          ))}

          {/* Dynamic section type tabs */}
          {isLoadingSectionTypes ? (
            <div className="flex items-center px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
            </div>
          ) : (
            activeSectionTypes.map((st) => (
              <button
                type="button"
                key={st.key}
                onClick={() => setActiveTab(st.key)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-sm whitespace-nowrap transition-colors focus-visible:outline-none ${
                  activeTab === st.key
                    ? 'border-cyan-500 text-white'
                    : 'border-transparent text-zinc-500 hover:border-white/20 hover:text-white'
                }`}
              >
                {st.displayName}
              </button>
            ))
          )}
        </nav>
      </div>

      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
}
