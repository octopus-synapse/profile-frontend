/**
 * GenericSectionEditor - Dynamic section editor based on backend definitions
 *
 * Replaces section-specific editors (experiences-section.tsx, education-section.tsx, etc.)
 * with a single component that renders forms based on section type field definitions.
 */

'use client';

import { Loader2, Plus } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useI18n } from '@profile/i18n';
import { ConfirmDialog, useConfirmDialog } from '@/shared/components/ui/confirm-dialog';
import { useGenericSectionCRUD } from '../hooks/use-generic-section-crud';
import { hasValidDefinition, type SectionItem } from '../types/generic-section.types';
import { type FormErrors, type FormValues, getDefaultForType, isEmpty } from './section-editor-utils';
import { SectionItemForm } from './section-item-form';
import { SectionItemList } from './section-item-list';

interface GenericSectionEditorProps {
  resumeId: string;
  sectionTypeKey: string;
  title?: string;
  onDataChange?: () => void;
}

export function GenericSectionEditor({
  resumeId,
  sectionTypeKey,
  title,
  onDataChange,
}: GenericSectionEditorProps) {
  const {
    items,
    sectionType,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGenericSectionCRUD({ resumeId, sectionTypeKey });

  const { t } = useI18n();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { dialogProps, confirm } = useConfirmDialog();

  const fields = useMemo(() => {
    if (!hasValidDefinition(sectionType)) return [];
    return [...sectionType.definition.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [sectionType]);

  const displayTitle = title ?? sectionType?.title ?? t('resume.section.fallbackTitle');

  const initializeForm = useCallback(
    (item?: SectionItem) => {
      if (item) {
        setFormValues(item.content as FormValues);
      } else {
        const defaults: FormValues = {};
        for (const field of fields) {
          const defaultVal = field.defaultValue;
          if (defaultVal !== undefined && defaultVal !== null) {
            defaults[field.key] = defaultVal as FormValues[string];
          } else {
            defaults[field.key] = getDefaultForType(field.type);
          }
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
      if (field.required && isEmpty(value)) {
        errors[field.key] = t('resume.section.fieldRequired', { field: field.label });
      }
      if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        errors[field.key] = t('resume.section.fieldMaxLength', { field: field.label, max: field.maxLength });
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [fields, formValues]);

  const handleAddNew = useCallback(() => {
    setEditingItemId(null);
    setIsAddingNew(true);
    initializeForm();
  }, [initializeForm]);

  const handleEdit = useCallback(
    (item: SectionItem) => {
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
      if (editingItemId) {
        await updateItem(editingItemId, formValues);
      } else {
        await createItem(formValues);
      }
      handleCancel();
      onDataChange?.();
    } catch (err) {
      setFormErrors({ _form: err instanceof Error ? err.message : t('resume.section.failedSave') });
    }
  }, [editingItemId, formValues, validateForm, updateItem, createItem, handleCancel, onDataChange]);

  const handleDelete = useCallback(
    async (itemId: string) => {
      const confirmed = await confirm(
        t('resume.section.deleteItem.title'),
        t('resume.section.deleteItem.description'),
        { variant: 'danger', confirmLabel: t('action.delete') },
      );
      if (!confirmed) return;
      try {
        await deleteItem(itemId);
        if (editingItemId === itemId) handleCancel();
        onDataChange?.();
      } catch (err) {
        setFormErrors({ _form: err instanceof Error ? err.message : t('resume.section.failedDelete') });
      }
    },
    [confirm, deleteItem, editingItemId, handleCancel, onDataChange],
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
        {t('resume.section.failedLoad')} {error.message}
      </div>
    );
  }

  if (!hasValidDefinition(sectionType)) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">
        {t('resume.section.noDefinition')}
      </div>
    );
  }

  const isEditing = editingItemId !== null || isAddingNew;
  const isMutating = isCreating || isUpdating || isDeleting;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{displayTitle}</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {items.length === 1 ? t('resume.section.itemCountOne') : t('resume.section.itemCountOther', { count: items.length })}
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleAddNew}
            disabled={isMutating}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            {t('resume.section.addButton', { title: displayTitle })}
          </button>
        )}
      </div>

      {formErrors._form && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          {formErrors._form}
        </div>
      )}

      {!isEditing && (
        <SectionItemList
          items={items}
          fields={fields}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {isEditing && (
        <SectionItemForm
          fields={fields}
          values={formValues}
          errors={formErrors}
          onChange={handleFieldChange}
          onSave={handleSave}
          onCancel={handleCancel}
          isSaving={isCreating || isUpdating}
          isNew={isAddingNew}
        />
      )}

      <ConfirmDialog {...dialogProps} />
    </div>
  );
}
