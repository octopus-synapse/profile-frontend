'use client';

import { Loader2 } from 'lucide-react';
import type { FieldDefinition } from './field-input-shared';
import { GenericFieldInput } from './generic-field-input';

type FormValues = Record<string, unknown>;
type FormErrors = Record<string, string | undefined>;

interface SectionItemFormProps {
  fields: FieldDefinition[];
  values: FormValues;
  errors: FormErrors;
  onChange: (key: string, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isNew: boolean;
}

export function SectionItemForm({
  fields,
  values,
  errors,
  onChange,
  onSave,
  onCancel,
  isSaving,
  isNew,
}: SectionItemFormProps) {
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
