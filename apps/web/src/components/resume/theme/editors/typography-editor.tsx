/**
 * Typography Editor Component
 */

'use client';

import type { ResumeStyleConfig, TypographyTokens } from '../../types/config';

interface Props {
  config: Partial<ResumeStyleConfig>;
  onChange: (path: string, value: unknown) => void;
}

const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'open-sans', label: 'Open Sans' },
  { value: 'lato', label: 'Lato' },
  { value: 'merriweather', label: 'Merriweather' },
  { value: 'playfair', label: 'Playfair Display' },
  { value: 'source-serif', label: 'Source Serif' },
];

export function TypographyEditor({ config, onChange }: Props) {
  const typography: Partial<TypographyTokens> = config.tokens?.typography || {};
  const fontFamily = typography.fontFamily || { heading: 'inter', body: 'inter' };

  return (
    <div className="space-y-6">
      <SelectInput
        label="Heading Font"
        value={fontFamily.heading || 'inter'}
        options={FONT_OPTIONS}
        onChange={(v) => onChange('tokens.typography.fontFamily.heading', v)}
      />

      <SelectInput
        label="Body Font"
        value={fontFamily.body || 'inter'}
        options={FONT_OPTIONS}
        onChange={(v) => onChange('tokens.typography.fontFamily.body', v)}
      />

      <SelectInput
        label="Font Size"
        value={typography.fontSize || 'base'}
        options={[
          { value: 'xs', label: 'Extra Small' },
          { value: 'sm', label: 'Small' },
          { value: 'base', label: 'Normal' },
          { value: 'lg', label: 'Large' },
        ]}
        onChange={(v) => onChange('tokens.typography.fontSize', v)}
      />

      <SelectInput
        label="Heading Style"
        value={typography.headingStyle || 'bold'}
        options={[
          { value: 'bold', label: 'Bold' },
          { value: 'underline', label: 'Underlined' },
          { value: 'accent-border', label: 'Accent Border' },
          { value: 'accent-bg', label: 'Accent Background' },
          { value: 'uppercase', label: 'Uppercase' },
        ]}
        onChange={(v) => onChange('tokens.typography.headingStyle', v)}
      />

      <SelectInput
        label="Line Height"
        value={typography.lineHeight || 'normal'}
        options={[
          { value: 'tight', label: 'Tight' },
          { value: 'normal', label: 'Normal' },
          { value: 'relaxed', label: 'Relaxed' },
        ]}
        onChange={(v) => onChange('tokens.typography.lineHeight', v)}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
