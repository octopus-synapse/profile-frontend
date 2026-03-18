/**
 * Color Editor Component
 */

'use client';

import type { ColorPalette, ResumeStyleConfig } from '../../types/config';

interface Props {
  config: Partial<ResumeStyleConfig>;
  onChange: (path: string, value: unknown) => void;
}

export function ColorEditor({ config, onChange }: Props) {
  const colorTokens = config.tokens?.colors;
  const colors: Partial<ColorPalette> = colorTokens?.colors || {};
  const textColors = colors.text || { primary: '', secondary: '', accent: '' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <ColorInput
          label="Primary"
          value={colors.primary || '#3B82F6'}
          onChange={(v) => onChange('tokens.colors.colors.primary', v)}
        />
        <ColorInput
          label="Secondary"
          value={colors.secondary || '#64748B'}
          onChange={(v) => onChange('tokens.colors.colors.secondary', v)}
        />
        <ColorInput
          label="Background"
          value={colors.background || '#FFFFFF'}
          onChange={(v) => onChange('tokens.colors.colors.background', v)}
        />
        <ColorInput
          label="Surface"
          value={colors.surface || '#F8FAFC'}
          onChange={(v) => onChange('tokens.colors.colors.surface', v)}
        />
        <ColorInput
          label="Text Primary"
          value={textColors.primary || '#1E293B'}
          onChange={(v) => onChange('tokens.colors.colors.text.primary', v)}
        />
        <ColorInput
          label="Text Secondary"
          value={textColors.secondary || '#64748B'}
          onChange={(v) => onChange('tokens.colors.colors.text.secondary', v)}
        />
        <ColorInput
          label="Border"
          value={colors.border || '#E2E8F0'}
          onChange={(v) => onChange('tokens.colors.colors.border', v)}
        />
        <ColorInput
          label="Divider"
          value={colors.divider || '#F1F5F9'}
          onChange={(v) => onChange('tokens.colors.colors.divider', v)}
        />
      </div>

      <div className="space-y-4">
        <SelectInput
          label="Border Radius"
          value={colorTokens?.borderRadius || 'md'}
          options={['none', 'sm', 'md', 'lg', 'full']}
          onChange={(v) => onChange('tokens.colors.borderRadius', v)}
        />
        <SelectInput
          label="Shadows"
          value={colorTokens?.shadows || 'subtle'}
          options={['none', 'subtle', 'medium', 'strong']}
          onChange={(v) => onChange('tokens.colors.shadows', v)}
        />
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer rounded border"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded border px-2 py-1 font-mono text-sm"
        />
      </div>
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
  options: string[];
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
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
