/**
 * ProfileFormField — reusable form input with label and icon.
 */

'use client';

import type { LucideIcon } from 'lucide-react';
import { FormLabel, HelpTooltip } from '@/shared/components/ui';

interface ProfileFormFieldProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'tel' | 'url' | 'email';
  tooltip?: string;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none';

export function ProfileFormField({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  tooltip,
}: ProfileFormFieldProps) {
  return (
    <div>
      <FormLabel icon={icon}>
        {label}
        {tooltip && <HelpTooltip content={tooltip} />}
      </FormLabel>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT_CLASS}
      />
    </div>
  );
}

interface ProfileTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}

export function ProfileTextarea({
  label,
  value,
  onChange,
  placeholder,
  maxLength = 300,
  rows = 3,
}: ProfileTextareaProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
        {label}
        {maxLength && (
          <span className="ml-auto text-xs font-normal text-zinc-500">
            {value.length}/{maxLength}
          </span>
        )}
      </label>
      <textarea
        value={value}
        onChange={(e) => {
          if (e.target.value.length <= maxLength) onChange(e.target.value);
        }}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:border-white/20 focus:outline-none"
      />
    </div>
  );
}
