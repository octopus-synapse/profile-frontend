/**
 * Hook for generic section editor state management.
 * Handles queries, mutations, and form state.
 */

import {
  type GenericSectionItemDto,
  getResumesListResumeSectionsQueryKey,
  type ResolvedSectionTypeDto,
  type SectionItemPayloadDto,
  useResumesCreateItem,
  useResumesDeleteItem,
  useResumesListResumeSections,
  useResumesListTypes,
  useResumesUpdateItem,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import type { FieldDefinition } from './field-input-shared';
import {
  type FormErrors,
  type FormValues,
  getDefaultForType,
  isEmpty,
} from './section-editor-utils';

interface UseGenericSectionEditorProps {
  resumeId: string;
  sectionTypeKey: string;
  onDataChange?: () => void;
}

function hasValidDefinition(
  sectionType: ResolvedSectionTypeDto | undefined,
): sectionType is ResolvedSectionTypeDto & { definition: { fields: FieldDefinition[] } } {
  return (
    sectionType != null &&
    typeof sectionType.definition === 'object' &&
    sectionType.definition != null &&
    Array.isArray(sectionType.definition.fields)
  );
}

export function useGenericSectionEditor({
  resumeId,
  sectionTypeKey,
  onDataChange,
}: UseGenericSectionEditorProps) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { dialogProps, confirm } = useConfirmDialog();

  const typesQuery = useResumesListTypes(resumeId, undefined, {
    query: { enabled: !!resumeId, staleTime: 5 * 60 * 1000 },
  });

  const sectionsQuery = useResumesListResumeSections(resumeId, {
    query: { enabled: !!resumeId, staleTime: 30 * 1000 },
  });

  const sectionTypes = typesQuery.data?.data?.data?.sectionTypes ?? [];
  const sectionType = sectionTypes.find((st) => st.key === sectionTypeKey);
  const sections = sectionsQuery.data?.data?.data?.sections ?? [];
  const section = sections.find(
    (s) =>
      s.sectionTypeKey === sectionTypeKey ||
      (s.sectionType as { key?: string } | undefined)?.key === sectionTypeKey,
  );
  const items: GenericSectionItemDto[] = (section?.items ?? []) as GenericSectionItemDto[];

  const createMutation = useResumesCreateItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getResumesListResumeSectionsQueryKey(resumeId),
        });
      },
    },
  });

  const updateMutation = useResumesUpdateItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getResumesListResumeSectionsQueryKey(resumeId),
        });
      },
    },
  });

  const deleteMutation = useResumesDeleteItem({
    mutation: {
      onSuccess: async () => {
        await queryClient.refetchQueries({
          queryKey: getResumesListResumeSectionsQueryKey(resumeId),
        });
      },
    },
  });

  const fields = useMemo(() => {
    if (!hasValidDefinition(sectionType)) return [];
    return [...sectionType.definition.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [sectionType]);

  const initializeForm = useCallback(
    (item?: GenericSectionItemDto) => {
      if (item) {
        setFormValues(item.content as FormValues);
      } else {
        const defaults: FormValues = {};
        for (const field of fields) {
          const defaultVal = field.defaultValue;
          defaults[field.key] =
            defaultVal !== undefined && defaultVal !== null
              ? (defaultVal as FormValues[string])
              : getDefaultForType(field.type);
        }
        setFormValues(defaults);
      }
      setFormErrors({});
    },
    [fields],
  );

  const handleFieldChange = useCallback((key: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [key]: value as FormValues[string] }));
    setFormErrors((prev) => {
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    for (const field of fields) {
      const value = formValues[field.key];
      const fieldLabel = field.label || field.key;
      if (field.required && isEmpty(value)) {
        errors[field.key] = t('resume.section.fieldRequired', { field: fieldLabel });
      }
      if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        errors[field.key] = t('resume.section.fieldMaxLength', {
          field: fieldLabel,
          max: field.maxLength,
        });
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, formValues, t]);

  const handleAddNew = useCallback(() => {
    setEditingItemId(null);
    setIsAddingNew(true);
    initializeForm();
  }, [initializeForm]);

  const handleEdit = useCallback(
    (item: GenericSectionItemDto) => {
      setIsAddingNew(false);
      setEditingItemId(item.id);
      initializeForm(item);
    },
    [initializeForm],
  );

  const handleCancel = useCallback(() => {
    setEditingItemId(null);
    setIsAddingNew(false);
    setFormValues({});
    setFormErrors({});
  }, []);

  const handleSave = useCallback(async () => {
    if (!validateForm()) return;
    try {
      const payload: SectionItemPayloadDto = { content: formValues };
      if (editingItemId) {
        await updateMutation.mutateAsync({
          resumeId,
          sectionTypeKey,
          itemId: editingItemId,
          data: payload,
        });
      } else {
        await createMutation.mutateAsync({ resumeId, sectionTypeKey, data: payload });
      }
      handleCancel();
      onDataChange?.();
    } catch (err) {
      setFormErrors({ _form: err instanceof Error ? err.message : t('resume.section.failedSave') });
    }
  }, [
    editingItemId,
    formValues,
    validateForm,
    updateMutation,
    createMutation,
    handleCancel,
    onDataChange,
    resumeId,
    sectionTypeKey,
    t,
  ]);

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
        if (editingItemId === itemId) handleCancel();
        onDataChange?.();
      } catch (err) {
        setFormErrors({
          _form: err instanceof Error ? err.message : t('resume.section.failedDelete'),
        });
      }
    },
    [
      confirm,
      deleteMutation,
      editingItemId,
      handleCancel,
      onDataChange,
      resumeId,
      sectionTypeKey,
      t,
    ],
  );

  return {
    // State
    editingItemId,
    isAddingNew,
    formValues,
    formErrors,
    dialogProps,
    // Data
    sectionType,
    items,
    fields,
    // Loading/error states
    isLoading: typesQuery.isLoading || sectionsQuery.isLoading,
    error: typesQuery.error ?? sectionsQuery.error,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    // Helpers
    hasValidDefinition: hasValidDefinition(sectionType),
    isEditing: editingItemId !== null || isAddingNew,
    isMutating: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
    // Actions
    handleFieldChange,
    handleAddNew,
    handleEdit,
    handleCancel,
    handleSave,
    handleDelete,
  };
}
