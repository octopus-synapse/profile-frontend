'use client';

/**
 * Phone Input Component
 * Input with automatic phone number formatting
 */

import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  /** Country code format: "BR" | "US" | "auto" */
  countryFormat?: 'BR' | 'US' | 'auto';
}

/**
 * Format phone number based on country
 * BR: +55 (11) 99999-9999
 * US: +1 (555) 123-4567
 */
function formatPhoneNumber(value: string, format: 'BR' | 'US' | 'auto'): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');

  if (!digits) return '';

  // Detect format if auto
  let effectiveFormat = format;
  if (format === 'auto') {
    // If starts with 55 or has 10-11 digits after country code, assume BR
    if (digits.startsWith('55') || (digits.length >= 10 && digits.length <= 11)) {
      effectiveFormat = 'BR';
    } else {
      effectiveFormat = 'US';
    }
  }

  if (effectiveFormat === 'BR') {
    // Brazilian format: +55 (11) 99999-9999
    if (digits.length <= 2) {
      return `+${digits}`;
    }
    if (digits.length <= 4) {
      return `+${digits.slice(0, 2)} (${digits.slice(2)}`;
    }
    if (digits.length <= 9) {
      return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4)}`;
    }
    if (digits.length <= 13) {
      const areaCode = digits.slice(2, 4);
      const firstPart = digits.slice(4, 9);
      const secondPart = digits.slice(9, 13);
      if (secondPart) {
        return `+${digits.slice(0, 2)} (${areaCode}) ${firstPart}-${secondPart}`;
      }
      return `+${digits.slice(0, 2)} (${areaCode}) ${firstPart}`;
    }
    // Limit to max length
    const limited = digits.slice(0, 13);
    return `+${limited.slice(0, 2)} (${limited.slice(2, 4)}) ${limited.slice(4, 9)}-${limited.slice(9)}`;
  }

  // US format: +1 (555) 123-4567
  if (digits.length <= 1) {
    return `+${digits}`;
  }
  if (digits.length <= 4) {
    return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
  }
  if (digits.length <= 7) {
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
  }
  if (digits.length <= 11) {
    const areaCode = digits.slice(1, 4);
    const firstPart = digits.slice(4, 7);
    const secondPart = digits.slice(7, 11);
    if (secondPart) {
      return `+${digits.slice(0, 1)} (${areaCode}) ${firstPart}-${secondPart}`;
    }
    return `+${digits.slice(0, 1)} (${areaCode}) ${firstPart}`;
  }
  // Limit to max length
  const limited = digits.slice(0, 11);
  return `+${limited.slice(0, 1)} (${limited.slice(1, 4)}) ${limited.slice(4, 7)}-${limited.slice(7)}`;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = '', onChange, countryFormat = 'auto', placeholder, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;

      // If user is deleting, allow raw value
      if (rawValue.length < (value?.length || 0)) {
        onChange?.(rawValue);
        return;
      }

      const formatted = formatPhoneNumber(rawValue, countryFormat);
      onChange?.(formatted);
    };

    // Format initial value if needed
    const displayValue = value ? formatPhoneNumber(value, countryFormat) : '';

    return (
      <input
        type="tel"
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        placeholder={
          placeholder || (countryFormat === 'BR' ? '+55 (11) 99999-9999' : '+1 (555) 123-4567')
        }
        className={cn(
          'border-white/10 bg-[#0A0A0A]/95 text-white',
          'placeholder:text-zinc-600 focus:border-cyan-500',
          'w-full border px-3 py-2 font-mono text-sm focus:outline-none',
          className,
        )}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';
