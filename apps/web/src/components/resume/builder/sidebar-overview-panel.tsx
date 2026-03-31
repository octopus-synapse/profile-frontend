/**
 * SidebarOverviewPanel — preview tab content showing theme, stats, sections, and tools.
 */

'use client';

import { useI18n } from '@profile/i18n';
import {
  ArrowUpDown,
  BarChart3,
  ChevronRight,
  Edit3,
  FileUp,
  History,
  Layers,
  RotateCcw,
  Settings,
  Share2,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { SidebarActionButton, SidebarSection } from './sidebar-helpers';

interface SectionStat {
  label: string;
  value: number;
}
interface EditableSection {
  key: string;
  title: string;
}

interface Props {
  activeThemeName?: string;
  stats: SectionStat[];
  editableSections?: EditableSection[];
  onThemeClick: () => void;
  onRefresh: () => void;
  onImportOpen: () => void;
  onHistoryOpen: () => void;
  onShareOpen: () => void;
  onAnalyticsOpen: () => void;
  onAtsOpen: () => void;
  onSectionEdit: (sectionTypeKey: string, title?: string) => void;
  onReorderOpen: () => void;
}

export function SidebarOverviewPanel({
  activeThemeName,
  stats,
  editableSections = [],
  onThemeClick,
  onRefresh,
  onImportOpen,
  onHistoryOpen,
  onShareOpen,
  onAnalyticsOpen,
  onAtsOpen,
  onSectionEdit,
  onReorderOpen,
}: Props) {
  const { t } = useI18n();

  const tools = [
    { icon: FileUp, label: t('resume.sidebar.tool.import'), onClick: onImportOpen },
    { icon: History, label: t('resume.sidebar.tool.versionHistory'), onClick: onHistoryOpen },
    { icon: Share2, label: t('resume.sidebar.tool.shareLinks'), onClick: onShareOpen },
    { icon: BarChart3, label: t('resume.sidebar.tool.analytics'), onClick: onAnalyticsOpen },
    { icon: Shield, label: t('resume.sidebar.tool.atsCheck'), onClick: onAtsOpen },
    { icon: ArrowUpDown, label: t('resume.sidebar.tool.reorderSections'), onClick: onReorderOpen },
  ];

  const formatSectionTitle = (s: EditableSection) =>
    s.title.replace(/_v\d+$/, '').replace(/_/g, ' ');

  return (
    <div className="p-4">
      <SidebarSection title={t('resume.sidebar.activeTheme')}>
        <button
          type="button"
          className="group flex w-full cursor-pointer items-center justify-between rounded-lg border border-pf-border-muted bg-pf-neutral-subtle p-3 text-left transition-all hover:border-pf-accent-fg/30 hover:bg-pf-accent-subtle"
          onClick={onThemeClick}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pf-accent-fg/20 to-purple-400/20 ring-1 ring-pf-border-default transition-all group-hover:ring-pf-accent-fg/30">
              <Layers className="h-5 w-5 text-pf-accent-fg" strokeWidth={1.5} />
            </div>
            <div>
              <span className="block text-sm font-medium text-pf-fg-default">
                {activeThemeName ?? t('resume.sidebar.defaultTheme')}
              </span>
              <span className="text-xs text-pf-fg-subtle">{t('resume.sidebar.clickToChange')}</span>
            </div>
          </div>
          <ChevronRight
            className="h-4 w-4 text-pf-fg-subtle transition-all group-hover:translate-x-0.5 group-hover:text-pf-accent-fg"
            strokeWidth={1.5}
          />
        </button>
      </SidebarSection>

      <SidebarSection title={t('resume.sidebar.stats.title')}>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-pf-border-muted bg-pf-neutral-subtle p-3"
            >
              <p className="text-2xl font-bold tabular-nums text-pf-fg-default">{stat.value}</p>
              <p className="mt-0.5 text-xs font-medium capitalize text-pf-fg-subtle">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </SidebarSection>

      {editableSections.length > 0 && (
        <SidebarSection title={t('settings.nav.sections')}>
          <div className="space-y-2">
            {editableSections.map((section) => (
              <SidebarActionButton
                key={section.key}
                icon={Edit3}
                label={formatSectionTitle(section)}
                onClick={() => onSectionEdit(section.key, section.title)}
              />
            ))}
          </div>
        </SidebarSection>
      )}

      <SidebarSection title={t('resume.sidebar.quickActions')}>
        <div className="space-y-2">
          <Link
            href="/protected/settings"
            className="group flex w-full items-center gap-3 rounded-lg border border-pf-border-muted bg-pf-neutral-subtle p-3 text-sm font-medium text-pf-fg-muted transition-all hover:border-pf-border-default hover:bg-pf-hover-subtle hover:text-pf-fg-default"
          >
            <Settings
              className="h-4 w-4 text-pf-fg-subtle transition-colors group-hover:text-pf-accent-fg"
              strokeWidth={1.5}
            />
            {t('resume.sidebar.editContent')}
          </Link>
          <SidebarActionButton
            icon={RotateCcw}
            label={t('resume.sidebar.refreshPreview')}
            onClick={onRefresh}
          />
        </div>
      </SidebarSection>

      <SidebarSection title={t('resume.sidebar.tools')}>
        <div className="space-y-2">
          {tools.map(({ icon, label, onClick }) => (
            <SidebarActionButton key={label} icon={icon} label={label} onClick={onClick} />
          ))}
        </div>
      </SidebarSection>
    </div>
  );
}
