/**
 * Preferences Section
 * Theme, language, and other preferences
 */

"use client";

import { Settings, Moon, Sun, Monitor, Globe, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">// Preferences</span>
        </div>
        <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
          Customize your experience
        </p>
      </div>

      {/* Theme Selection */}
      <div className="border-pf-border-default bg-pf-canvas-subtle border p-6">
        <h3 className="text-pf-fg-default mb-4 font-mono text-sm font-semibold">
          theme.preference
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-3 border p-4 transition-all ${
                theme === value
                  ? "border-pf-accent-fg bg-pf-accent-subtle"
                  : "border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  theme === value ? "text-pf-accent-fg" : "text-pf-fg-muted"
                }`}
                strokeWidth={1.5}
              />
              <span
                className={`font-mono text-sm ${
                  theme === value ? "text-pf-accent-fg font-semibold" : "text-pf-fg-default"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Visibility - Preview (not connected yet) */}
      <div className="border-pf-border-default bg-pf-canvas-subtle border p-6">
        <h3 className="text-pf-fg-default mb-2 font-mono text-sm font-semibold">
          visibility.profile
        </h3>
        <p className="text-pf-fg-muted mb-4 font-mono text-xs">
          Control who can see your public profile
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            disabled
            className="border-pf-border-default bg-pf-canvas-overlay flex items-center gap-3 border p-4 opacity-50"
          >
            <Eye className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
            <div className="text-left">
              <span className="text-pf-fg-default block font-mono text-sm">Public</span>
              <span className="text-pf-fg-subtle font-mono text-xs">Anyone can view</span>
            </div>
          </button>
          <button
            disabled
            className="border-pf-accent-fg bg-pf-accent-subtle flex items-center gap-3 border p-4"
          >
            <EyeOff className="text-pf-accent-fg h-5 w-5" strokeWidth={1.5} />
            <div className="text-left">
              <span className="text-pf-accent-fg block font-mono text-sm font-semibold">
                Private
              </span>
              <span className="text-pf-fg-muted font-mono text-xs">Only you can view</span>
            </div>
          </button>
        </div>
        <p className="text-pf-fg-subtle mt-3 font-mono text-xs italic">
          <span className="text-pf-attention-fg">*</span> Profile visibility settings coming soon
        </p>
      </div>

      {/* Language Setting - Preview (not connected yet) */}
      <div className="border-pf-border-default bg-pf-canvas-subtle border p-6">
        <h3 className="text-pf-fg-default mb-2 font-mono text-sm font-semibold">
          language.interface
        </h3>
        <p className="text-pf-fg-muted mb-4 font-mono text-xs">
          Choose your preferred interface language
        </p>
        <div className="flex items-center gap-3">
          <Globe className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <select
            disabled
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default flex-1 border px-3 py-2 font-mono text-sm opacity-50"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
        </div>
        <p className="text-pf-fg-subtle mt-3 font-mono text-xs italic">
          <span className="text-pf-attention-fg">*</span> Multi-language support coming soon
        </p>
      </div>

      {/* Code Block Preview */}
      <div className="code-block">
        <div className="code-block-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">preferences.config.ts</span>
        </div>
        <div className="code-block-content">
          <div>
            <span className="code-keyword">export const</span>{" "}
            <span className="code-variable">config</span> = {"{"}
          </div>
          <div className="ml-4">
            <span className="code-function">theme</span>:{" "}
            <span className="code-string">&quot;{theme}&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">language</span>:{" "}
            <span className="code-string">&quot;en&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">visibility</span>:{" "}
            <span className="code-string">&quot;private&quot;</span>,
          </div>
          <div>{"}"}</div>
        </div>
      </div>
    </div>
  );
}
