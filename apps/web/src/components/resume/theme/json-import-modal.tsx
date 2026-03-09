/**
 * JSON Import Modal
 * Clean modal to import theme from JSON
 */

"use client";

import { useState } from "react";
import { useCreateTheme } from "../hooks";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <FileJson
                className="h-5 w-5 text-neutral-600 dark:text-neutral-300"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Import Theme
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Create a theme from JSON configuration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-auto p-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Theme Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500 dark:focus:ring-neutral-700"
              placeholder="My Custom Theme"
            />
          </div>

          {/* JSON Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                JSON Configuration
              </label>
              <button
                onClick={() => void handlePaste()}
                className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                <Clipboard className="h-3.5 w-3.5" strokeWidth={1.5} />
                Paste from clipboard
              </button>
            </div>
            <div className="relative">
              <textarea
                value={json}
                onChange={(e) => validateJson(e.target.value)}
                className={cn(
                  "h-56 w-full rounded-lg border bg-neutral-50 p-4 font-mono text-xs text-neutral-800 transition-colors focus:ring-2 focus:outline-none dark:bg-neutral-800 dark:text-neutral-200",
                  error
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100 dark:border-red-700 dark:focus:ring-red-900/30"
                    : isValid
                      ? "border-green-300 focus:border-green-400 focus:ring-green-100 dark:border-green-700 dark:focus:ring-green-900/30"
                      : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-200 dark:border-neutral-700 dark:focus:ring-neutral-700"
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
                    <AlertCircle className="h-5 w-5 text-red-500" strokeWidth={1.5} />
                  ) : isValid ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" strokeWidth={1.5} />
                  ) : null}
                </div>
              )}
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={1.5} />
                {error}
              </p>
            )}
          </div>

          {/* Help */}
          <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
            <p className="mb-2 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              💡 Design Tokens Structure
            </p>
            <p className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
              Your JSON should include{" "}
              <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-700">layout</code>,{" "}
              <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-700">tokens</code>{" "}
              (typography, colors, spacing), and optionally{" "}
              <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-700">sections</code>{" "}
              configuration.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <button
            onClick={onClose}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={() => void handleImport()}
            disabled={!isValid || !name.trim() || createTheme.isPending}
            className="flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
          >
            <Upload className="h-4 w-4" strokeWidth={1.5} />
            {createTheme.isPending ? "Creating..." : "Create Theme"}
          </button>
        </div>
      </div>
    </div>
  );
}
