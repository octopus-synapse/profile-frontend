/**
 * Builder Sidebar
 * Clean panel for customization options
 */

'use client';

import {
  ArrowUpDown,
  BarChart3,
  ChevronRight,
  Eye,
  FileUp,
  History,
  Layers,
  Palette,
  RotateCcw,
  Settings,
  Share2,
  Shield,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useI18n } from '@profile/i18n';
import { cn } from '@/shared/utils';
import type { Theme } from '../services/theme.types';
import { ThemeEditor, ThemePicker } from '../theme';

type ViewMode = 'preview' | 'themes' | 'editor';

/**
 * Minimal resume data needed for sidebar display.
 * Accepts both ResumeDto (sections[]) and ResumeFullResponseDto (resumeSections[]).
 */
interface ResumeForSidebar {
  id: string;
  activeThemeId?: string;
  sections?: Array<{ sectionTypeKey?: string; items?: unknown[] }>;
  resumeSections?: Array<{ sectionTypeKey?: string; items?: unknown[] }>;
}

interface BuilderSidebarProps {
  resume: ResumeForSidebar;
  activeThemeName?: string;
  onThemeApplied: () => void;
  onRefresh: () => void;
  onImportOpen: () => void;
  onHistoryOpen: () => void;
  onShareOpen: () => void;
  onAnalyticsOpen: () => void;
  onAtsOpen: () => void;
  onSkillsOpen: () => void;
  onReorderOpen: () => void;
}

export function BuilderSidebar({
  resume,
  activeThemeName,
  onThemeApplied,
  onRefresh,
  onImportOpen,
  onHistoryOpen,
  onShareOpen,
  onAnalyticsOpen,
  onAtsOpen,
  onSkillsOpen,
  onReorderOpen,
}: BuilderSidebarProps) {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);

  const handleEditTheme = (theme: Theme) => {
    setEditingTheme(theme);
    setViewMode('editor');
  };

  const handleEditorClose = () => {
    setEditingTheme(null);
    setViewMode('themes');
  };

  const handleThemeSaved = () => {
    onThemeApplied();
    setEditingTheme(null);
    setViewMode('themes');
  };

  const handleThemeApplied = () => {
    onThemeApplied();
    setViewMode('preview');
  };

  // Stats derived from generic sections (supports both ResumeDto and ResumeFullResponseDto)
  const allSections = resume.sections ?? resume.resumeSections ?? [];
  const getSectionCount = (key: string) =>
    allSections.find((s) => s.sectionTypeKey === key)?.items?.length ?? 0;

  const stats = [
    { label: t('resume.sidebar.stats.experience'), value: getSectionCount('work_experience_v1') },
    { label: t('resume.sidebar.stats.education'), value: getSectionCount('education_v1') },
    { label: t('resume.sidebar.stats.skills'), value: getSectionCount('skill_set_v1') },
    { label: t('resume.sidebar.stats.languages'), value: getSectionCount('language_v1') },
  ];

  return (
    <aside className="border-pf-border-muted bg-pf-canvas-overlay flex w-80 flex-col border-r">
      {/* Tabs */}
      <div className="border-pf-border-muted flex border-b">
        <TabButton
          active={viewMode === 'preview'}
          onClick={() => setViewMode('preview')}
          icon={<Eye className="h-4 w-4" strokeWidth={1.5} />}
          label={t('resume.sidebar.tabs.overview')}
        />
        <TabButton
          active={viewMode === 'themes' || viewMode === 'editor'}
          onClick={() => setViewMode('themes')}
          icon={<Palette className="h-4 w-4" strokeWidth={1.5} />}
          label={t('resume.sidebar.tabs.themes')}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'preview' && (
          <div className="p-4">
            {/* Current Theme */}
            <Section title={t('resume.sidebar.activeTheme')}>
              <button
                type="button"
                onClick={() => setViewMode('themes')}
                className="border-pf-border-default bg-pf-canvas-subtle group hover:border-pf-border-emphasis hover:bg-pf-canvas-inset flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-pf-canvas-overlay flex h-8 w-8 items-center justify-center rounded-md shadow-sm">
                    <Layers className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
                  </div>
                  <span className="text-pf-fg-default text-sm font-medium">
                    {activeThemeName ?? t('resume.sidebar.defaultTheme')}
                  </span>
                </div>
                <ChevronRight
                  className="text-pf-fg-subtle h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.5}
                />
              </button>
            </Section>

            {/* Stats */}
            <Section title={t('resume.sidebar.stats.title')}>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-pf-canvas-subtle rounded-lg p-3">
                    <p className="text-pf-fg-default text-2xl font-semibold">{stat.value}</p>
                    <p className="text-pf-fg-subtle text-xs">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Quick Actions */}
            <Section title={t('resume.sidebar.quickActions')}>
              <div className="space-y-2">
                <Link
                  href="/protected/settings"
                  className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
                >
                  <Settings className="text-pf-fg-subtle h-4 w-4" strokeWidth={1.5} />
                  {t('resume.sidebar.editContent')}
                </Link>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
                >
                  <RotateCcw className="text-pf-fg-subtle h-4 w-4" strokeWidth={1.5} />
                  {t('resume.sidebar.refreshPreview')}
                </button>
              </div>
            </Section>

            {/* Tools */}
            <Section title={t('resume.sidebar.tools')}>
              <div className="space-y-2">
                {[
                    { icon: FileUp, label: t('resume.sidebar.tool.import'), onClick: onImportOpen },
                    { icon: History, label: t('resume.sidebar.tool.versionHistory'), onClick: onHistoryOpen },
                    { icon: Share2, label: t('resume.sidebar.tool.shareLinks'), onClick: onShareOpen },
                    { icon: BarChart3, label: t('resume.sidebar.tool.analytics'), onClick: onAnalyticsOpen },
                    { icon: Shield, label: t('resume.sidebar.tool.atsCheck'), onClick: onAtsOpen },
                    { icon: Tag, label: t('resume.sidebar.tool.skills'), onClick: onSkillsOpen },
                    { icon: ArrowUpDown, label: t('resume.sidebar.tool.reorderSections'), onClick: onReorderOpen },
                  ].map(({ icon: Icon, label, onClick }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={onClick}
                    className="border-pf-border-default text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-3 rounded-lg border p-3 text-sm font-medium transition-colors"
                  >
                    <Icon className="text-pf-fg-subtle h-4 w-4" strokeWidth={1.5} />
                    {label}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        )}

        {viewMode === 'themes' && (
          <div className="p-4">
            <ThemePicker
              resumeId={resume.id}
              activeThemeId={resume.activeThemeId ?? null}
              onThemeApplied={handleThemeApplied}
              onEditTheme={handleEditTheme}
            />
          </div>
        )}

        {viewMode === 'editor' && editingTheme && (
          <ThemeEditor
            theme={editingTheme}
            onCancel={handleEditorClose}
            onSave={handleThemeSaved}
          />
        )}
      </div>
    </aside>
  );
}

// Helper Components

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
        active
          ? 'border-pf-border-emphasis text-pf-fg-default'
          : 'text-pf-fg-muted hover:text-pf-fg-default border-transparent',
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h3 className="text-pf-fg-muted mb-3 text-xs font-medium tracking-wider uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}
