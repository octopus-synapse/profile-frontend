/**
 * BuilderDialogs — renders all dialogs for the resume builder.
 * Keeps dialog JSX out of the main component.
 */

'use client';

import { useI18n } from '@profile/i18n';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { AnalyticsDashboard } from '../analytics/analytics-dashboard';
import { AtsScorePanel } from '../ats/ats-score-panel';
import type { SectionItem } from '../config/section-reorder-panel';
import { SectionReorderPanel } from '../config/section-reorder-panel';
import { ExportDialog } from '../export/export-dialog';
import { GenericSectionEditor } from '../generic/generic-section-editor';
import { ImportWizard } from '../import/import-wizard';
import { ShareLinksManager } from '../sharing/share-links-manager';
import { VersionHistorySidebar } from '../versions/version-history-sidebar';
import type { DialogId } from './use-builder-dialogs';

interface SectionEditorState {
  sectionTypeKey: string | null;
  title: string | null;
}

interface Props {
  resumeId: string;
  sections: SectionItem[];
  isOpen: Record<DialogId, boolean>;
  toggle: (id: DialogId, isOpen: boolean) => void;
  sectionEditor: SectionEditorState;
  onToggleVisibility: (sectionId: string, visible: boolean) => Promise<void>;
  onReorder: (sectionId: string, order: number) => Promise<void>;
  onBatchUpdate: (
    sections: Array<{ id: string; visible?: boolean; order?: number }>,
  ) => Promise<void>;
}

export function BuilderDialogs({
  resumeId,
  sections,
  isOpen,
  toggle,
  sectionEditor,
  onToggleVisibility,
  onReorder,
  onBatchUpdate,
}: Props) {
  const { t } = useI18n();

  return (
    <>
      <ExportDialog
        resumeId={resumeId}
        open={isOpen.export}
        onOpenChange={(o) => toggle('export', o)}
      />
      <ImportWizard open={isOpen.import} onOpenChange={(o) => toggle('import', o)} />
      <VersionHistorySidebar
        resumeId={resumeId}
        open={isOpen.history}
        onOpenChange={(o) => toggle('history', o)}
      />

      <Dialog open={isOpen.share} onOpenChange={(o) => toggle('share', o)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.shareLinks.title')}</DialogTitle>
            <DialogDescription>
              {t('resume.builder.dialog.shareLinks.description')}
            </DialogDescription>
          </DialogHeader>
          <ShareLinksManager resumeId={resumeId} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen.analytics} onOpenChange={(o) => toggle('analytics', o)}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.analytics.title')}</DialogTitle>
            <DialogDescription>
              {t('resume.builder.dialog.analytics.description')}
            </DialogDescription>
          </DialogHeader>
          <AnalyticsDashboard resumeId={resumeId} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen.ats} onOpenChange={(o) => toggle('ats', o)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.ats.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.ats.description')}</DialogDescription>
          </DialogHeader>
          <AtsScorePanel resumeId={resumeId} />
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen.sectionEditor} onOpenChange={(o) => toggle('sectionEditor', o)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{sectionEditor.title ?? 'Edit Section'}</DialogTitle>
            <DialogDescription>{t('settings.resume.sections.description')}</DialogDescription>
          </DialogHeader>
          {sectionEditor.sectionTypeKey && (
            <GenericSectionEditor
              resumeId={resumeId}
              sectionTypeKey={sectionEditor.sectionTypeKey}
              title={sectionEditor.title ?? undefined}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isOpen.reorder} onOpenChange={(o) => toggle('reorder', o)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('resume.builder.dialog.reorder.title')}</DialogTitle>
            <DialogDescription>{t('resume.builder.dialog.reorder.description')}</DialogDescription>
          </DialogHeader>
          <SectionReorderPanel
            resumeId={resumeId}
            sections={sections}
            onToggleVisibility={onToggleVisibility}
            onReorder={onReorder}
            onBatchUpdate={onBatchUpdate}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
