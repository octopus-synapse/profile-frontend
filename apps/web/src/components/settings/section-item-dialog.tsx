'use client';

/**
 * SectionItemDialog — Dialog for adding/editing section items
 * Reuses the existing SectionItemForm and useGenericSectionEditor hook
 */

import {
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@octopus-synapse/profile-ui';
import type { GenericSectionItemDto } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SectionItemForm } from '@/components/resume/generic/section-item-form';
import { useGenericSectionEditor } from '@/components/resume/generic/use-generic-section-editor';

interface SectionItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  sectionTypeKey: string;
  sectionLabel: string;
  /** Item to edit. If null, creates a new item */
  editItem?: GenericSectionItemDto | null;
  onSuccess?: () => void;
}

export function SectionItemDialog({
  open,
  onOpenChange,
  resumeId,
  sectionTypeKey,
  sectionLabel,
  editItem = null,
  onSuccess,
}: SectionItemDialogProps) {
  const { t } = useI18n();
  const initializedRef = useRef(false);

  const editor = useGenericSectionEditor({
    resumeId,
    sectionTypeKey,
    onDataChange: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && !editor.isLoading && !initializedRef.current) {
      initializedRef.current = true;
      if (editItem) {
        editor.handleEdit(editItem);
      } else {
        editor.handleAddNew();
      }
    }
    if (!open) {
      initializedRef.current = false;
    }
  }, [open, editor, editItem]);

  const handleClose = () => {
    editor.handleCancel();
    onOpenChange(false);
  };

  const isNew = !editItem;
  const dialogTitle = isNew
    ? sectionLabel
    : t('settings.sections.editItemTitle', { section: sectionLabel });
  const dialogDescription = isNew
    ? t('settings.sections.addItemDescription')
    : t('settings.sections.editItemDescription');

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-h-[85vh] overflow-hidden !bg-[#0c0c0e] !border-zinc-800/50 sm:max-w-lg">
          <DialogHeader className="!pb-0">
            <DialogTitle className="text-lg font-light text-white">{dialogTitle}</DialogTitle>
            <DialogDescription className="text-[13px] text-zinc-500">
              {dialogDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {editor.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-600" />
              </div>
            ) : editor.error ? (
              <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4 text-sm text-red-400">
                {t('resume.section.failedLoad')}
              </div>
            ) : !editor.hasValidDefinition ? (
              <div className="py-8 text-center text-sm text-zinc-500">
                {t('resume.section.noDefinition')}
              </div>
            ) : (
              <SectionItemForm
                fields={editor.fields}
                values={editor.formValues}
                errors={editor.formErrors}
                onChange={editor.handleFieldChange}
                onSave={editor.handleSave}
                onCancel={handleClose}
                isSaving={editor.isCreating || editor.isUpdating}
                isNew={isNew}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog {...editor.dialogProps} />
    </>
  );
}
