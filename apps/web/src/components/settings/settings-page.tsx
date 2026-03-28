/**
 * Settings Page — Swiss Minimalism
 * Clean typography, generous whitespace, zero decoration noise.
 */

'use client';

import {
  useResumesGetAllUserResumes,
  useResumesListResumeSections,
  useResumesListTypes,
} from '@profile/api-client';
import { type DictionaryKey, useI18n } from '@profile/i18n';
import { ChevronRight, FileText, Loader2, Plus, Settings, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { GenericSectionEditor } from '@/components/resume/generic';
import { SectionIcon } from '@/shared/components/section-icon';
import { DangerZone } from './account/danger-zone';
import { AddSectionDialog } from './add-section-dialog';
import { PreferencesSection } from './preferences-section';
import { ProfileSection } from './profile-section';
import { ResumeBasicsSection } from './resume-basics-section';
import { categorizeSections } from './settings-page.utils';
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
  const [addSectionOpen, setAddSectionOpen] = useState(false);

  const resumesQuery = useResumesGetAllUserResumes({ page: 1, limit: 1 });
  const resumes = (resumesQuery.data?.data?.data as Record<string, unknown> | undefined)?.data as
    | Array<{ id: string }>
    | undefined;
  const resumeId = resumes?.[0]?.id ?? null;
  const isLoadingResumeId = resumesQuery.isLoading;

  const sectionTypesQuery = useResumesListTypes(resumeId ?? '', undefined, {
    query: { enabled: !!resumeId, staleTime: 5 * 60 * 1000 },
  });
  const sectionTypes =
    ((sectionTypesQuery.data?.data?.data as Record<string, unknown> | undefined)
      ?.sectionTypes as Array<Record<string, unknown>>) ?? [];
  const isLoadingSectionTypes = sectionTypesQuery.isLoading;

  const sectionsQuery = useResumesListResumeSections(resumeId ?? '', {
    query: { enabled: !!resumeId, staleTime: 30 * 1000 },
  });
  const sections =
    ((sectionsQuery.data?.data?.data as Record<string, unknown> | undefined)?.sections as Array<
      Record<string, unknown>
    >) ?? [];
  const isLoadingSections = sectionsQuery.isLoading;

  const { existing: existingSections, available: availableSections } = categorizeSections(
    sectionTypes,
    sections,
  );
  const isLoadingNavigation =
    isLoadingResumeId || isLoadingSectionTypes || (!!resumeId && isLoadingSections);

  const renderContent = () => {
    switch (activeTab) {
      case 'resume':
        return (
          <ResumeBasicsSection
            dynamicSections={existingSections}
            onOpenSection={(sectionKey) => setActiveTab(sectionKey)}
          />
        );
      case 'profile':
        return <ProfileSection />;
      case 'preferences':
        return <PreferencesSection />;
      case 'account':
        return (
          <div className="space-y-16">
            <TwoFactorSettings />
            <DangerZone />
          </div>
        );
      default: {
        if (!resumeId) {
          return (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
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
    <div className="min-h-screen bg-[#09090b]">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {/* Header */}
        <header className="mb-16">
          <Link
            href="/protected"
            className="inline-flex items-center gap-1.5 text-[13px] text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <ChevronRight className="h-3.5 w-3.5 rotate-180" strokeWidth={1.5} />
            <span>{t('app.settings.backToDashboard')}</span>
          </Link>
          <h1 className="mt-8 text-[32px] font-light tracking-[-0.02em] text-white">
            {t('app.settings.title')}
          </h1>
        </header>

        {/* Layout */}
        <div className="flex gap-16 lg:gap-24">
          {/* Sidebar */}
          <aside className="hidden w-48 shrink-0 lg:block">
            <nav className="sticky top-12 space-y-8">
              {/* Main */}
              <NavGroup label={t('app.settings.tabs.resume')}>
                {STATIC_TABS.filter((tab) => tab.id === 'resume').map(
                  ({ id, labelKey, icon: Icon }) => (
                    <NavItem key={id} active={activeTab === id} onClick={() => setActiveTab(id)}>
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span>{t(labelKey)}</span>
                    </NavItem>
                  ),
                )}
              </NavGroup>

              {/* Sections */}
              <NavGroup label={t('settings.nav.sections')}>
                {isLoadingNavigation ? (
                  <div className="py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
                  </div>
                ) : (
                  <>
                    {existingSections.map((section) => (
                      <NavItem
                        key={section.key}
                        active={activeTab === section.key}
                        onClick={() => setActiveTab(section.key)}
                        badge={section.count > 0 ? section.count : undefined}
                      >
                        <SectionIcon iconType={section.iconType} icon={section.icon} size={14} />
                        <span>{section.label}</span>
                      </NavItem>
                    ))}
                    {availableSections.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setAddSectionOpen(true)}
                        className="mt-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-zinc-800 px-3 py-2 text-[13px] text-zinc-500 transition-all hover:border-zinc-700 hover:text-zinc-300"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{t('settings.sections.addNew')}</span>
                      </button>
                    )}
                  </>
                )}
              </NavGroup>

              {/* Account */}
              <NavGroup label={t('settings.nav.account')}>
                {STATIC_TABS.filter((tab) => tab.id !== 'resume').map(
                  ({ id, labelKey, icon: Icon }) => (
                    <NavItem key={id} active={activeTab === id} onClick={() => setActiveTab(id)}>
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                      <span>{t(labelKey)}</span>
                    </NavItem>
                  ),
                )}
              </NavGroup>
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="mb-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {STATIC_TABS.map(({ id, labelKey }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm transition-colors ${
                  activeTab === id ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>

          {/* Content */}
          <main className="min-w-0 flex-1">{renderContent()}</main>
        </div>
      </div>

      {resumeId && (
        <AddSectionDialog
          open={addSectionOpen}
          onOpenChange={setAddSectionOpen}
          availableSections={availableSections}
          resumeId={resumeId}
          onSuccess={() => void sectionsQuery.refetch()}
        />
      )}
    </div>
  );
}

function NavGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.1em] text-zinc-600">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  children,
  active,
  onClick,
  badge,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-all ${
        active
          ? 'bg-white/[0.08] text-white'
          : 'text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300'
      }`}
    >
      <span className="flex items-center gap-2.5">{children}</span>
      {badge !== undefined && (
        <span className="text-[11px] tabular-nums text-zinc-600">{badge}</span>
      )}
    </button>
  );
}
