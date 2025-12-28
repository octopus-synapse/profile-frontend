/**
 * JSON Import Modal Component
 * Beautiful modal to import theme from JSON
 */

"use client";

import { useState } from "react";
import { useCreateTheme } from "../../hooks";
import type { ResumeStyleConfig } from "../../types/config";
import { X, Upload, Clipboard, FileJson, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/shared/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImported?: (themeId: string) => void;
}

export function JsonImportModal({ isOpen, onClose, onImported }: Props) {
  const [json, setJson] = useState("");
  const [name, setName] = useState("My Custom Theme");
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const createTheme = useCreateTheme();

  if (!isOpen) return null;

  const validateJson = (value: string) => {
    setJson(value);
    setError(null);
    setIsValid(false);

    if (!value.trim()) return;

    try {
      const parsed = JSON.parse(value) as Partial<ResumeStyleConfig>;
      if (!parsed.layout && !parsed.tokens && !parsed.sections) {
        setError("Must include layout, tokens, or sections");
        return;
      }
      setIsValid(true);
    } catch {
      setError("Invalid JSON syntax");
    }
  };

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(json) as Partial<ResumeStyleConfig>;

      const theme = await createTheme.mutateAsync({
        name,
        category: "MODERN",
        styleConfig: parsed as Record<string, unknown>,
      });

      onImported?.(theme.id);
      onClose();
      setJson("");
      setName("My Custom Theme");
      setError(null);
      setIsValid(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create theme");
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      validateJson(text);
    } catch {
      setError("Failed to read clipboard");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-pf-canvas-default border-pf-border-default mx-4 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border shadow-2xl">
        {/* Header */}
        <div className="border-pf-border-default flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-pf-accent-subtle text-pf-accent-fg rounded-lg p-2">
              <FileJson className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-pf-fg-default text-lg font-semibold">Import Theme</h2>
              <p className="text-pf-fg-muted text-xs">Create a theme from JSON configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-auto p-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <label className="text-pf-fg-default text-sm font-medium">Theme Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-muted focus:border-pf-accent-emphasis focus:ring-pf-accent-emphasis/20 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:ring-2 focus:outline-none"
              placeholder="My Custom Theme"
            />
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-pf-fg-default text-sm font-medium">JSON Configuration</label>
              <button
                onClick={handlePaste}
                className="text-pf-accent-fg hover:text-pf-accent-emphasis flex items-center gap-1.5 text-xs font-medium transition-colors"
              >
                <Clipboard className="h-3.5 w-3.5" />
                Paste from clipboard
              </button>
            </div>
            <div className="relative">
              <textarea
                value={json}
                onChange={(e) => validateJson(e.target.value)}
                className={cn(
                  "border-pf-border-default bg-pf-canvas-inset text-pf-fg-default h-56 w-full rounded-lg border p-4 font-mono text-xs transition-colors focus:ring-2 focus:outline-none",
                  error
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                    : isValid
                      ? "border-green-400 focus:border-green-400 focus:ring-green-400/20"
                      : "focus:border-pf-accent-emphasis focus:ring-pf-accent-emphasis/20"
                )}
                placeholder={`{
  "layout": {
    "type": "single-column",
    "paperSize": "a4",
    "margins": "normal"
  },
  "tokens": {
    "typography": {
      "fontFamily": { "heading": "inter", "body": "inter" },
      "fontSize": "base",
      "headingStyle": "accent-border"
    },
    "colors": {
      "colors": {
        "primary": "#3B82F6",
        "background": "#FFFFFF",
        "text": { "primary": "#1E293B" }
      }
    }
  }
}`}
                spellCheck={false}
              />
              {/* Validation indicator */}
              {json && (
                <div className="absolute top-3 right-3">
                  {error ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : null}
                </div>
              )}
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Help */}
          <div className="bg-pf-canvas-subtle rounded-lg p-4">
            <p className="text-pf-fg-default mb-2 text-xs font-medium">
              💡 Design Tokens Structure
            </p>
            <p className="text-pf-fg-muted text-xs leading-relaxed">
              Your JSON should include{" "}
              <code className="bg-pf-canvas-inset rounded px-1">layout</code>,{" "}
              <code className="bg-pf-canvas-inset rounded px-1">tokens</code> (typography, colors,
              spacing), and optionally{" "}
              <code className="bg-pf-canvas-inset rounded px-1">sections</code> configuration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-pf-border-default flex items-center justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="border-pf-border-default text-pf-fg-default hover:bg-pf-canvas-subtle rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!isValid || !name.trim() || createTheme.isPending}
            className="bg-pf-accent-emphasis text-pf-fg-on-emphasis flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {createTheme.isPending ? "Creating..." : "Create Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}
