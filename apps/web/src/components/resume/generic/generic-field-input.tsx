/**
 * GenericFieldInput - Dynamic form field based on field definition
 *
 * Renders appropriate input type based on field.type from section definition.
 * Handles validation based on field.required and type-specific constraints.
 */

'use client';

import type React from 'react';
import { useId } from 'react';
import type { FieldDefinition } from '../types/generic-section.types';

interface GenericFieldInputProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

const INPUT_BASE =
  'w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:opacity-50';

const INPUT_ERROR =
  'w-full rounded-lg border border-red-500/50 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white ' +
  'placeholder:text-zinc-600 focus:border-red-500/70 focus:outline-none disabled:opacity-50';

type FieldRenderProps = {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled: boolean;
  inputId: string;
  errorId: string;
  inputClass: string;
};

function renderStringField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
  inputClass,
}: FieldRenderProps) {
  return (
    <input
      id={inputId}
      type="text"
      className={inputClass}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      maxLength={field.maxLength}
      required={field.required}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
}

function renderTextField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
  inputClass,
}: FieldRenderProps) {
  return (
    <textarea
      id={inputId}
      className={`${inputClass} min-h-[100px] resize-y`}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
      maxLength={field.maxLength}
      required={field.required}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
}

function renderNumberField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
  inputClass,
}: FieldRenderProps) {
  return (
    <input
      id={inputId}
      type="number"
      className={inputClass}
      value={typeof value === 'number' ? value : ''}
      onChange={(e) => onChange(e.target.valueAsNumber || null)}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      required={field.required}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
}

function renderDateField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
  inputClass,
}: FieldRenderProps) {
  return (
    <input
      id={inputId}
      type="date"
      className={inputClass}
      value={formatDateValue(value)}
      onChange={(e) => onChange(e.target.value || null)}
      required={field.required}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
    />
  );
}

function renderBooleanField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
}: FieldRenderProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        id={inputId}
        type="checkbox"
        className="h-4 w-4 rounded border-white/10 bg-zinc-900"
        checked={Boolean(value)}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
      />
      <span className="text-sm text-zinc-300">{field.placeholder || field.label}</span>
    </label>
  );
}

function renderEnumField({
  field,
  value,
  onChange,
  error,
  disabled,
  inputId,
  errorId,
  inputClass,
}: FieldRenderProps) {
  return (
    <select
      id={inputId}
      className={`${inputClass} cursor-pointer`}
      value={typeof value === 'string' ? value : ''}
      onChange={(e) => onChange(e.target.value || null)}
      required={field.required}
      disabled={disabled}
      aria-invalid={!!error}
      aria-describedby={error ? errorId : undefined}
    >
      <option value="">{field.placeholder ?? `Select ${field.label.toLowerCase()}`}</option>
      {(field.enumValues ?? []).map((option) => (
        <option key={option} value={option}>
          {formatEnumLabel(option)}
        </option>
      ))}
    </select>
  );
}

function renderArrayField({ field, value, onChange, error, disabled, errorId }: FieldRenderProps) {
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

const FIELD_RENDERERS: Partial<
  Record<FieldDefinition['type'], (props: FieldRenderProps) => React.ReactNode>
> = {
  string: renderStringField,
  text: renderTextField,
  number: renderNumberField,
  date: renderDateField,
  boolean: renderBooleanField,
  enum: renderEnumField,
  array: renderArrayField,
};

export function GenericFieldInput({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: GenericFieldInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputClass = error ? INPUT_ERROR : INPUT_BASE;

  const renderProps: FieldRenderProps = {
    field,
    value,
    onChange,
    error,
    disabled,
    inputId,
    errorId,
    inputClass,
  };
  const renderer = FIELD_RENDERERS[field.type] ?? renderStringField;
  const input = renderer(renderProps);

  if (field.type === 'boolean') {
    return (
      <div className="space-y-1">
        {input}
        {error && (
          <p id={errorId} className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-white">
        {field.label}
        {field.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {input}
      {error && (
        <p id={errorId} className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
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

function formatDateValue(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split('T')[0] ?? '';
    }
    return value;
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0] ?? '';
  }
  return '';
}

function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
