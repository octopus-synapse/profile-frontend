/**
 * GenericSectionEditor - Dynamic section editor based on backend definitions
 *
 * Uses SDK-generated hooks directly. NO manual types, NO manual hooks.
 * Backend is the source of truth for section types, fields, and validation.
 * All add/edit operations open in a dialog for better UX.
 */

'use client';

import {
  type GenericSectionItemDto,
  getResumesListResumeSectionsQueryKey,
  useResumesDeleteItem,
  useResumesListResumeSections,
  useResumesListTypes,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { SectionItemDialog } from '@/components/settings/section-item-dialog';
import { ConfirmDialog, useConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import type { FieldDefinition } from './field-input-shared';
import { SectionItemList } from './section-item-list';

interface GenericSectionEditorProps {
  resumeId: string;
  sectionTypeKey: string;
  title?: string;
  onDataChange?: () => void;
}

function hasValidDefinition(
  sectionType: { definition?: unknown } | undefined,
): sectionType is { definition: { fields: FieldDefinition[] } } {
  return (
    sectionType != null &&
    typeof sectionType.definition === 'object' &&
    sectionType.definition != null &&
    Array.isArray((sectionType.definition as { fields?: unknown }).fields)
  );
}

export function GenericSectionEditor({
  resumeId,
  sectionTypeKey,
  title,
  onDataChange,
}: GenericSectionEditorProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { dialogProps, confirm } = useConfirmDialog();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GenericSectionItemDto | null>(null);

  // Queries
  const typesQuery = useResumesListTypes(resumeId, undefined, {
    query: { enabled: !!resumeId, staleTime: 5 * 60 * 1000 },
  });

  const sectionsQuery = useResumesListResumeSections(resumeId, {
    query: { enabled: !!resumeId, staleTime: 30 * 1000 },
  });

  const deleteMutation = useResumesDeleteItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getResumesListResumeSectionsQueryKey(resumeId),
        });
        onDataChange?.();
      },
    },
  });

  // Derived data
  const sectionTypes = typesQuery.data?.data?.data?.sectionTypes ?? [];
  const sectionType = sectionTypes.find((st) => st.key === sectionTypeKey);
  const sections = sectionsQuery.data?.data?.data?.sections ?? [];
  const section = sections.find(
    (s) =>
      s.sectionTypeKey === sectionTypeKey ||
      (s.sectionType as { key?: string } | undefined)?.key === sectionTypeKey,
  );
  const items: GenericSectionItemDto[] = (section?.items ?? []) as GenericSectionItemDto[];
  const fields = hasValidDefinition(sectionType)
    ? [...sectionType.definition.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  const displayTitle = title ?? sectionType?.title ?? t('resume.section.fallbackTitle');
  const isLoading = typesQuery.isLoading || sectionsQuery.isLoading;
  const error = typesQuery.error ?? sectionsQuery.error;

  // Handlers
  const handleAddNew = useCallback(() => {
    setEditingItem(null);
    setDialogOpen(true);
  }, []);

  const handleEdit = useCallback((item: GenericSectionItemDto) => {
    setEditingItem(item);
    setDialogOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (itemId: string) => {
      const confirmed = await confirm(
        t('resume.section.deleteItem.title'),
        t('resume.section.deleteItem.description'),
        { variant: 'danger', confirmLabel: t('action.delete') },
      );
      if (!confirmed) return;
      try {
        await deleteMutation.mutateAsync({ resumeId, sectionTypeKey, itemId });
      } catch {
        // Error handling is done by the mutation
      }
    },
    [confirm, deleteMutation, resumeId, sectionTypeKey, t],
  );

  const handleDialogSuccess = useCallback(() => {
    setDialogOpen(false);
    setEditingItem(null);
    onDataChange?.();
  }, [onDataChange]);

  const handleDialogClose = useCallback((open: boolean) => {
    if (!open) {
      setDialogOpen(false);
      setEditingItem(null);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-pf-fg-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-pf-danger-muted bg-pf-danger-subtle p-4 text-sm text-pf-danger-fg">
        {t('resume.section.failedLoad')} {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  if (!hasValidDefinition(sectionType)) {
    return (
      <div className="py-8 text-center text-sm text-pf-fg-subtle">
        {t('resume.section.noDefinition')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-pf-fg-default">{displayTitle}</h2>
          <p className="mt-1 text-sm text-pf-fg-muted">
            {items.length === 1
              ? t('resume.section.itemCountOne')
              : t('resume.section.itemCountOther', { count: items.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          disabled={deleteMutation.isPending}
          className="flex items-center gap-2 rounded-lg border border-pf-border-default px-4 py-2 text-sm font-medium text-pf-fg-default transition-colors hover:bg-pf-hover-subtle disabled:opacity-50"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          {t('resume.section.addButton', { title: displayTitle })}
        </button>
      </div>

      <SectionItemList
        items={items}
        fields={fields}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

      <SectionItemDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        resumeId={resumeId}
        sectionTypeKey={sectionTypeKey}
        sectionLabel={displayTitle}
        editItem={editingItem}
        onSuccess={handleDialogSuccess}
      />

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
