/**
 * Layout Editor Component
 */

'use client';

import type { LayoutConfig, ResumeStyleConfig } from '../../types/config';

interface Props {
  config: Partial<ResumeStyleConfig>;
  onChange: (path: string, value: unknown) => void;
}

export function LayoutEditor({ config, onChange }: Props) {
  const layout: Partial<LayoutConfig> = config.layout || {};
  const isTwoColumn =
    layout.type === 'two-column' ||
    layout.type === 'sidebar-left' ||
    layout.type === 'sidebar-right';

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SelectInput
          label="Layout Type"
          value={layout.type || 'single-column'}
          options={[
            { value: 'single-column', label: 'Single Column' },
            { value: 'two-column', label: 'Two Column' },
            { value: 'sidebar-left', label: 'Sidebar Left' },
            { value: 'sidebar-right', label: 'Sidebar Right' },
          ]}
          onChange={(v) => onChange('layout.type', v)}
        />

        {isTwoColumn && (
          <SelectInput
            label="Column Distribution"
            value={layout.columnDistribution || '60-40'}
            options={[
              { value: '50-50', label: '50% / 50%' },
              { value: '60-40', label: '60% / 40%' },
              { value: '65-35', label: '65% / 35%' },
              { value: '70-30', label: '70% / 30%' },
            ]}
            onChange={(v) => onChange('layout.columnDistribution', v)}
          />
        )}

        <SelectInput
          label="Paper Size"
          value={layout.paperSize || 'a4'}
          options={[
            { value: 'a4', label: 'A4' },
            { value: 'letter', label: 'US Letter' },
            { value: 'legal', label: 'US Legal' },
          ]}
          onChange={(v) => onChange('layout.paperSize', v)}
        />

        <SelectInput
          label="Margins"
          value={layout.margins || 'normal'}
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'relaxed', label: 'Relaxed' },
            { value: 'wide', label: 'Wide' },
          ]}
          onChange={(v) => onChange('layout.margins', v)}
        />
      </div>

      <div className="space-y-4 border-t pt-4">
        <h4 className="text-sm font-medium">Page Numbers</h4>
        <CheckboxInput
          label="Show page numbers"
          checked={layout.showPageNumbers || false}
          onChange={(v) => onChange('layout.showPageNumbers', v)}
        />

        {layout.showPageNumbers && (
          <SelectInput
            label="Position"
            value={layout.pageNumberPosition || 'bottom-center'}
            options={[
              { value: 'bottom-center', label: 'Bottom Center' },
              { value: 'bottom-right', label: 'Bottom Right' },
              { value: 'top-right', label: 'Top Right' },
            ]}
            onChange={(v) => onChange('layout.pageNumberPosition', v)}
          />
        )}
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

function CheckboxInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border"
      />
      <span className="text-sm">{label}</span>
    </label>
  );
}
