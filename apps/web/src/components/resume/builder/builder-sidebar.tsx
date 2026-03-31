/**
 * BuilderSidebar — clean panel for customization options.
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Eye, Palette } from 'lucide-react';
import { useState } from 'react';
import { ThemeEditor, ThemePicker } from '../theme';
import type { Theme } from '../types/config';
import { SidebarTabButton } from './sidebar-helpers';
import { SidebarOverviewPanel } from './sidebar-overview-panel';

type ViewMode = 'preview' | 'themes' | 'editor';

interface ResumeForSidebar {
  id: string;
  activeThemeId?: string;
  sections?: Array<{
    sectionTypeKey?: string;
    items?: unknown[];
    sectionType?: { title?: string };
  }>;
  resumeSections?: Array<{
    sectionTypeKey?: string;
    items?: unknown[];
    sectionType?: { title?: string };
  }>;
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
  onSectionEdit: (sectionTypeKey: string, title?: string) => void;
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
  onSectionEdit,
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

  const allSections = resume.sections ?? resume.resumeSections ?? [];
  const stats = allSections
    .filter((s) => (s.items?.length ?? 0) > 0)
    .map((s) => ({
      label:
        s.sectionType?.title ??
        s.sectionTypeKey?.replace(/_v\d+$/, '').replace(/_/g, ' ') ??
        'Section',
      value: s.items?.length ?? 0,
    }));
  const editableSections = allSections
    .filter((s) => s.sectionTypeKey)
    .map((s) => ({ key: s.sectionTypeKey!, title: s.sectionType?.title ?? s.sectionTypeKey! }));

  return (
    <aside className="flex w-80 flex-col border-r border-pf-border-default bg-pf-canvas-subtle">
      <div className="flex border-b border-pf-border-default">
        <SidebarTabButton
          active={viewMode === 'preview'}
          onClick={() => setViewMode('preview')}
          icon={<Eye className="h-4 w-4" strokeWidth={1.5} />}
          label={t('resume.sidebar.tabs.overview')}
        />
        <SidebarTabButton
          active={viewMode === 'themes' || viewMode === 'editor'}
          onClick={() => setViewMode('themes')}
          icon={<Palette className="h-4 w-4" strokeWidth={1.5} />}
          label={t('resume.sidebar.tabs.themes')}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === 'preview' && (
          <SidebarOverviewPanel
            activeThemeName={activeThemeName}
            stats={stats}
            editableSections={editableSections}
            onThemeClick={() => setViewMode('themes')}
            onRefresh={onRefresh}
            onImportOpen={onImportOpen}
            onHistoryOpen={onHistoryOpen}
            onShareOpen={onShareOpen}
            onAnalyticsOpen={onAnalyticsOpen}
            onAtsOpen={onAtsOpen}
            onSectionEdit={onSectionEdit}
            onReorderOpen={onReorderOpen}
          />
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
