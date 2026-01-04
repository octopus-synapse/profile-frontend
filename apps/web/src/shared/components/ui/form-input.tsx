/**
 * Reusable Form Input Components
 * Standardized form inputs with consistent styling
 */

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-white">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export function TextInput({ label, required, className = "", ...props }: TextInputProps) {
  const input = (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:opacity-50 ${className}`}
    />
  );

  if (label) {
    return (
      <FormField label={label} required={required}>
        {input}
      </FormField>
    );
  }

  return input;
}

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export function DateInput({ label, required, className = "", ...props }: DateInputProps) {
  const input = (
    <input
      type="date"
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none disabled:opacity-50 ${className}`}
    />
  );

  if (label) {
    return (
      <FormField label={label} required={required}>
        {input}
      </FormField>
    );
  }

  return input;
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
}

export function TextArea({ label, required, className = "", rows = 3, ...props }: TextAreaProps) {
  const textarea = (
    <textarea
      {...props}
      rows={rows}
      className={`w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none disabled:opacity-50 ${className}`}
    />
  );

  if (label) {
    return (
      <FormField label={label} required={required}>
        {textarea}
      </FormField>
    );
  }

  return textarea;
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className = "", ...props }: CheckboxProps) {
  return (
    <label className="flex items-center gap-3">
      <input {...props} type="checkbox" className={`h-4 w-4 rounded border-white/10 ${className}`} />
      <span className="text-sm text-zinc-400">{label}</span>
    </label>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  required,
  options,
  className = "",
  ...props
}: SelectProps) {
  const select = (
    <select
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none disabled:opacity-50 ${className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (label) {
    return (
      <FormField label={label} required={required}>
        {select}
      </FormField>
    );
  }

  return select;
}
