/**
 * Profile Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import Link from "next/link";
import { User, Code2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile",
};

export default function ProfilePage() {
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
          <span className="text-pf-fg-muted font-mono text-xs">// Profile</span>
        </div>
        <h1 className="text-pf-fg-default mt-2 text-3xl font-bold">
          edit_profile<span className="text-pf-fg-muted font-normal">()</span>
        </h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Manage your public profile information
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="border-pf-border-default bg-pf-canvas-overlay border p-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis mb-6 flex h-16 w-16 items-center justify-center">
            <User className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <div className="dev-badge mb-4">
            <span className="text-code-variable">●</span> in_development
          </div>

          <h2 className="text-pf-fg-default mb-2 font-mono text-lg font-semibold">
            profile_editor
          </h2>
          <p className="text-pf-fg-muted max-w-md font-mono text-sm">
            Build and customize your professional profile
          </p>
        </div>
      </div>

      {/* Status Terminal */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/profile/editor</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">profile status</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-attention-fg">⚠ Profile editor is under construction</div>
            <div className="text-pf-fg-muted mt-1">
              Check back soon for the full profile editing experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
