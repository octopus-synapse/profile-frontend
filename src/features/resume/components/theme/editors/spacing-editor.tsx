/**
 * Spacing Editor Component
 */

"use client";

import type { ResumeStyleConfig, SpacingTokens } from "../../../types/config";

interface Props {
  config: Partial<ResumeStyleConfig>;
  onChange: (path: string, value: unknown) => void;
}

export function SpacingEditor({ config, onChange }: Props) {
  const spacing: Partial<SpacingTokens> = config.tokens?.spacing || {};

  return (
    <div className="space-y-6">
      <SelectInput
        label="Density"
        value={spacing.density || "comfortable"}
        options={[
          { value: "compact", label: "Compact" },
          { value: "comfortable", label: "Comfortable" },
          { value: "spacious", label: "Spacious" },
        ]}
        description="Controls overall whitespace"
        onChange={(v) => onChange("tokens.spacing.density", v)}
      />

      <SelectInput
        label="Section Gap"
        value={spacing.sectionGap || "lg"}
        options={[
          { value: "xs", label: "Extra Small" },
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
          { value: "xl", label: "Extra Large" },
        ]}
        description="Space between sections"
        onChange={(v) => onChange("tokens.spacing.sectionGap", v)}
      />

      <SelectInput
        label="Item Gap"
        value={spacing.itemGap || "md"}
        options={[
          { value: "xs", label: "Extra Small" },
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ]}
        description="Space between items within sections"
        onChange={(v) => onChange("tokens.spacing.itemGap", v)}
      />

      <SelectInput
        label="Content Padding"
        value={spacing.contentPadding || "md"}
        options={[
          { value: "sm", label: "Small" },
          { value: "md", label: "Medium" },
          { value: "lg", label: "Large" },
        ]}
        description="Inner padding of sections"
        onChange={(v) => onChange("tokens.spacing.contentPadding", v)}
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  description,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  description?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {description && <p className="text-muted-foreground text-xs">{description}</p>}
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
