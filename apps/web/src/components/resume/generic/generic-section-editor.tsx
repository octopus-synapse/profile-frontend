/**
 * GenericSectionEditor - Dynamic section editor based on backend definitions
 *
 * Replaces section-specific editors (experiences-section.tsx, education-section.tsx, etc.)
 * with a single component that renders forms based on section type field definitions.
 */

'use client';

import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useGenericSectionCRUD } from '../hooks/use-generic-section-crud';
import {
  type FieldDefinition,
  hasValidDefinition,
  type SectionItem,
  type SectionTypeMetadata,
} from '../types/generic-section.types';
import { GenericFieldInput } from './generic-field-input';

interface GenericSectionEditorProps {
  resumeId: string;
  sectionTypeKey: string;
  title?: string;
  onDataChange?: () => void;
}

type FormValues = Record<string, string | number | boolean | null | string[] | undefined>;
type FormErrors = Record<string, string>;

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

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const fields = useMemo(() => {
    if (!hasValidDefinition(sectionType)) return [];
    return [...sectionType.definition.fields].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [sectionType]);

  const displayTitle = title ?? sectionType?.title ?? 'Section';

  const initializeForm = useCallback(
    (item?: SectionItem) => {
      if (item) {
        // Cast content to FormValues - we trust the backend schema
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
        errors[field.key] = `${field.label} is required`;
      }
      if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        errors[field.key] = `${field.label} must be at most ${field.maxLength} characters`;
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
      setFormErrors({ _form: err instanceof Error ? err.message : 'Failed to save' });
    }
  }, [editingItemId, formValues, validateForm, updateItem, createItem, handleCancel, onDataChange]);

  const handleDelete = useCallback(
    async (itemId: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return;
      try {
        await deleteItem(itemId);
        if (editingItemId === itemId) handleCancel();
        onDataChange?.();
      } catch (err) {
        setFormErrors({ _form: err instanceof Error ? err.message : 'Failed to delete' });
      }
    },
    [deleteItem, editingItemId, handleCancel, onDataChange],
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
        Failed to load section: {error.message}
      </div>
    );
  }

  if (!hasValidDefinition(sectionType)) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">
        Section type not found or has no field definitions.
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
            {items.length} {items.length === 1 ? 'item' : 'items'} added
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
            Add {displayTitle}
          </button>
        )}
      </div>

      {formErrors._form && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
          {formErrors._form}
        </div>
      )}

      {!isEditing && (
        <ItemList
          items={items}
          fields={fields}
          sectionType={sectionType}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {isEditing && (
        <ItemForm
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
    </div>
  );
}

function ItemList({
  items,
  fields,
  onEdit,
  onDelete,
  isDeleting,
}: {
  items: SectionItem[];
  fields: FieldDefinition[];
  sectionType: SectionTypeMetadata;
  onEdit: (item: SectionItem) => void;
  onDelete: (itemId: string) => void;
  isDeleting: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-sm text-zinc-400">No items yet. Click "Add" to create one.</p>
      </div>
    );
  }

  const titleField = fields.find(
    (f) =>
      f.semanticRole === 'TITLE' ||
      f.key === 'title' ||
      f.key === 'company' ||
      f.key === 'institution' ||
      f.key === 'name',
  );
  const subtitleField = fields.find(
    (f) =>
      f.semanticRole === 'SUBTITLE' ||
      f.key === 'position' ||
      f.key === 'role' ||
      f.key === 'degree' ||
      f.key === 'level',
  );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="group rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-white">
                {titleField ? String(item.content[titleField.key] || 'Untitled') : 'Item'}
              </h4>
              {subtitleField && item.content[subtitleField.key] != null && (
                <p className="mt-1 text-sm text-zinc-400">
                  {String(item.content[subtitleField.key])}
                </p>
              )}
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => void onDelete(item.id)}
                disabled={isDeleting}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemForm({
  fields,
  values,
  errors,
  onChange,
  onSave,
  onCancel,
  isSaving,
  isNew,
}: {
  fields: FieldDefinition[];
  values: FormValues;
  errors: FormErrors;
  onChange: (key: string, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isNew: boolean;
}) {
  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
      {fields.map((field) => (
        <GenericFieldInput
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
          error={errors[field.key]}
          disabled={isSaving}
        />
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isNew ? 'Add' : 'Update'}
        </button>
      </div>
    </div>
  );
}

function getDefaultForType(type: FieldDefinition['type']): FormValues[string] {
  switch (type) {
    case 'string':
    case 'text':
    case 'enum':
      return '';
    case 'number':
      return null;
    case 'boolean':
      return false;
    case 'date':
      return null;
    case 'array':
      return [];
    default:
      return '';
  }
}

function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
