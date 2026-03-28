/**
 * GenericFieldInput - Dynamic form field based on field definition
 *
 * Renders appropriate input type based on field.type from section definition.
 * Handles validation based on field.required and type-specific constraints.
 *
 * Field-type renderers for array fields are in ./array-field-input.tsx.
 * Shared types, styles, and utilities are in ./field-input-shared.ts.
 */

'use client';

import type React from 'react';
import { useId } from 'react';
import { renderArrayField } from './array-field-input';
import {
  type FieldDefinition,
  type FieldRenderProps,
  type FieldType,
  formatDateValue,
  formatEnumLabel,
  INPUT_BASE,
  INPUT_ERROR,
} from './field-input-shared';

interface GenericFieldInputProps {
  field: FieldDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  disabled?: boolean;
}

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
      <span className="text-sm text-zinc-300">{field.placeholder || field.label || field.key}</span>
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
      <option value="">
        {field.placeholder ?? `Select ${(field.label || field.key || 'option').toLowerCase()}`}
      </option>
      {(field.enumValues ?? []).map((option) => (
        <option key={option} value={option}>
          {formatEnumLabel(option)}
        </option>
      ))}
    </select>
  );
}

const FIELD_RENDERERS: Partial<Record<FieldType, (props: FieldRenderProps) => React.ReactNode>> = {
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
        {field.label || field.key}
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
