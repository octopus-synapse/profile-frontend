/**
 * Theme Editor Component
 * Edit theme with live preview
 * Auto-forks public themes on save
 */

"use client";

import { useState, useCallback } from "react";
import { useCreateTheme, useUpdateTheme, useForkTheme } from "../../hooks";
import type { Theme } from "../../services/theme.types";
import type { ResumeStyleConfig } from "../../types/config";
import { ColorEditor, TypographyEditor, LayoutEditor, SpacingEditor } from "./editors";

interface Props {
  theme?: Theme | null;
  onSave?: (theme: Theme) => void;
  onCancel?: () => void;
}

type EditorTab = "layout" | "colors" | "typography" | "spacing" | "json";

export function ThemeEditor({ theme, onSave, onCancel }: Props) {
  const isNew = !theme;
  const isPublicOrSystem = theme?.status === "PUBLISHED" || theme?.isSystemTheme;

  const [name, setName] = useState(theme?.name || "My Custom Theme");
  const [config, setConfig] = useState<Partial<ResumeStyleConfig>>(
    (theme?.styleConfig as Partial<ResumeStyleConfig>) || {}
  );
  const [tab, setTab] = useState<EditorTab>("layout");

  const createTheme = useCreateTheme();
  const updateTheme = useUpdateTheme();
  const forkTheme = useForkTheme();

  const updateConfig = useCallback((path: string, value: unknown) => {
    setConfig((prev) => {
      const keys = path.split(".");
      if (keys.length === 0) return prev;

      const result = { ...prev };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let current: any = result;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i]!;
        current[key] = { ...(current[key] || {}) };
        current = current[key];
      }
      const lastKey = keys[keys.length - 1]!;
      current[lastKey] = value;
      return result as Partial<ResumeStyleConfig>;
    });
  }, []);

  const handleSave = async () => {
    try {
      let saved: Theme;

      if (isNew) {
        // Create new theme
        saved = await createTheme.mutateAsync({
          name,
          category: "MODERN",
          styleConfig: config as Record<string, unknown>,
        });
      } else if (isPublicOrSystem) {
        // Fork public/system theme (creates private copy)
        saved = await forkTheme.mutateAsync({ themeId: theme!.id, name: `${name} (Custom)` });
        // Then update the fork with new config
        saved = await updateTheme.mutateAsync({
          id: saved.id,
          input: { styleConfig: config as Record<string, unknown> },
        });
      } else {
        // Direct update for own private themes
        saved = await updateTheme.mutateAsync({
          id: theme!.id,
          input: { name, styleConfig: config as Record<string, unknown> },
        });
      }

      onSave?.(saved);
    } catch (error) {
      console.error("Failed to save theme:", error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="hover:border-muted focus:border-primary border-b border-transparent bg-transparent text-lg font-medium outline-none"
            placeholder="Theme name"
          />
          {isPublicOrSystem && (
            <p className="text-muted-foreground mt-1 text-xs">Editing will create a private copy</p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={onCancel} className="hover:bg-muted rounded border px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={createTheme.isPending || updateTheme.isPending || forkTheme.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {isPublicOrSystem ? "Save as Copy" : "Save"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {(["layout", "colors", "typography", "spacing", "json"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize ${
              tab === t ? "border-primary border-b-2 font-medium" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-auto p-4">
        {tab === "layout" && <LayoutEditor config={config} onChange={updateConfig} />}
        {tab === "colors" && <ColorEditor config={config} onChange={updateConfig} />}
        {tab === "typography" && <TypographyEditor config={config} onChange={updateConfig} />}
        {tab === "spacing" && <SpacingEditor config={config} onChange={updateConfig} />}
        {tab === "json" && <JsonEditor config={config} onChange={setConfig} />}
      </div>
    </div>
  );
}

function JsonEditor({
  config,
  onChange,
}: {
  config: Partial<ResumeStyleConfig>;
  onChange: (c: Partial<ResumeStyleConfig>) => void;
}) {
  const [json, setJson] = useState(JSON.stringify(config, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    setJson(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
      setError(null);
    } catch {
      setError("Invalid JSON");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={json}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-muted/50 h-96 w-full rounded border p-4 font-mono text-sm"
        spellCheck={false}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
