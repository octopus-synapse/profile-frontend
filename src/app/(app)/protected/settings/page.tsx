/**
 * Settings Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import Link from "next/link";
import { Settings, Code2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
  description: "Account settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/protected"
          className="text-pf-fg-muted hover:text-pf-fg-default mb-4 inline-flex items-center gap-2 font-mono text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          back_to_dashboard
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">// Settings</span>
        </div>
        <h1 className="text-pf-fg-default mt-2 text-3xl font-bold">
          configure<span className="text-pf-fg-muted font-normal">()</span>
        </h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="border-pf-border-default bg-pf-canvas-overlay border p-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis mb-6 flex h-16 w-16 items-center justify-center">
            <Settings className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <div className="dev-badge mb-4">
            <span className="text-code-variable">●</span> in_development
          </div>

          <h2 className="text-pf-fg-default mb-2 font-mono text-lg font-semibold">
            settings_panel
          </h2>
          <p className="text-pf-fg-muted max-w-md font-mono text-sm">
            Configure your account preferences
          </p>
        </div>
      </div>

      {/* Code Block Preview */}
      <div className="code-block">
        <div className="code-block-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">settings.config.ts</span>
        </div>
        <div className="code-block-content">
          <div>
            <span className="code-keyword">export const</span>{" "}
            <span className="code-variable">preferences</span> = {"{"}
          </div>
          <div className="ml-4">
            <span className="code-function">theme</span>:{" "}
            <span className="code-string">&quot;system&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">language</span>:{" "}
            <span className="code-string">&quot;en&quot;</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">notifications</span>:{" "}
            <span className="code-keyword">true</span>,
          </div>
          <div className="ml-4">
            <span className="code-function">privacy</span>:{" "}
            <span className="code-string">&quot;private&quot;</span>,
          </div>
          <div>{"}"}</div>
        </div>
      </div>

      {/* Terminal Hint */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/profile/settings</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">profile config --list</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-attention-fg">⚠ Settings panel is under construction</div>
            <div className="text-pf-fg-muted mt-1">
              Check back soon for the full settings experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
