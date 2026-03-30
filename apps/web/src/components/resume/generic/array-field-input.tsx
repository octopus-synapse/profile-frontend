/**
 * ArrayFieldInput - Dynamic array field for generic section forms.
 *
 * Renders a list of text inputs with add/remove controls.
 * Extracted from generic-field-input to keep files under 300 lines.
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import {
  type FieldDefinition,
  type FieldRenderProps,
  INPUT_BASE,
  INPUT_ERROR,
} from './field-input-shared';

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
          <Button
            type="button"
            variant="ghost"
            tone="danger"
            size="xs"
            iconOnly
            disabled={disabled}
            aria-label={`Remove ${(field.label || field.key || 'item').toLowerCase()} item`}
            onPress={() => removeItem(index)}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="link"
        tone="neutral"
        size="sm"
        disabled={disabled}
        onPress={addItem}
      >
        + Add {(field.label || field.key || 'item').toLowerCase()}
      </Button>
      {error && (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
