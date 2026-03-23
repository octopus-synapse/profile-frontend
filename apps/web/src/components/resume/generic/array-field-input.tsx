/**
 * ArrayFieldInput - Dynamic array field for generic section forms.
 *
 * Renders a list of text inputs with add/remove controls.
 * Extracted from generic-field-input to keep files under 300 lines.
 */

'use client';

import type { FieldDefinition } from '../types/generic-section.types';
import { INPUT_BASE, INPUT_ERROR, type FieldRenderProps } from './field-input-shared';

export function renderArrayField({
  field,
  value,
  onChange,
  disabled,
  error,
  errorId,
}: FieldRenderProps) {
  return (
    <ArrayFieldInput
      field={field}
      value={Array.isArray(value) ? value : []}
      onChange={onChange}
      disabled={disabled}
      error={error}
      errorId={errorId}
    />
  );
}

function ArrayFieldInput({
  field,
  value,
  onChange,
  disabled,
  error,
  errorId,
}: {
  field: FieldDefinition;
  value: unknown[];
  onChange: (value: unknown) => void;
  disabled: boolean;
  error?: string;
  errorId: string;
}) {
  const addItem = () => onChange([...value, '']);

  const removeItem = (index: number) => {
    const next = [...value];
    next.splice(index, 1);
    onChange(next);
  };

  const updateItem = (index: number, itemValue: string) => {
    const next = [...value];
    next[index] = itemValue;
    onChange(next);
  };

  const inputClass = error ? INPUT_ERROR : INPUT_BASE;

  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            className={`${inputClass} flex-1`}
            value={String(item ?? '')}
            onChange={(e) => updateItem(index, e.target.value)}
            placeholder={field.placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            disabled={disabled}
            className="shrink-0 rounded-lg p-2 text-zinc-400 transition-colors hover:text-red-400 disabled:opacity-50"
            aria-label={`Remove ${field.label.toLowerCase()} item`}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        disabled={disabled}
        className="text-sm text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
      >
        + Add {field.label.toLowerCase()}
      </button>
      {error && (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
