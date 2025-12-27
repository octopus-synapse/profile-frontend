/**
 * Resume Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import Link from "next/link";
import { FileText, Code2, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Resume",
  description: "Manage your resume",
};

export default function ResumePage() {
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
          <span className="text-pf-fg-muted font-mono text-xs">// Resume</span>
        </div>
        <h1 className="text-pf-fg-default mt-2 text-3xl font-bold">
          manage_resume<span className="text-pf-fg-muted font-normal">()</span>
        </h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Build and customize your professional resume
        </p>
      </div>

      {/* Coming Soon Card */}
      <div className="border-pf-border-default bg-pf-canvas-overlay border p-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis mb-6 flex h-16 w-16 items-center justify-center">
            <FileText className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <div className="dev-badge mb-4">
            <span className="text-code-variable">●</span> in_development
          </div>

          <h2 className="text-pf-fg-default mb-2 font-mono text-lg font-semibold">
            resume_builder
          </h2>
          <p className="text-pf-fg-muted max-w-md font-mono text-sm">
            Create and export your resume in multiple formats
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
          <span className="code-block-title">resume.config.ts</span>
        </div>
        <div className="code-block-content">
          <div>
            <span className="code-keyword">export const</span>{" "}
            <span className="code-variable">exportOptions</span> = {"{"}
          </div>
          <div className="ml-4">
            <span className="code-function">formats</span>: [
            <span className="code-string">&quot;pdf&quot;</span>,{" "}
            <span className="code-string">&quot;docx&quot;</span>,{" "}
            <span className="code-string">&quot;html&quot;</span>],
          </div>
          <div className="ml-4">
            <span className="code-function">templates</span>: [
            <span className="code-string">&quot;modern&quot;</span>,{" "}
            <span className="code-string">&quot;classic&quot;</span>,{" "}
            <span className="code-string">&quot;minimal&quot;</span>],
          </div>
          <div className="ml-4">
            <span className="code-function">ats_friendly</span>:{" "}
            <span className="code-keyword">true</span>,
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
          <span className="code-block-title">~/profile/resume</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">resume export --format pdf</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-attention-fg">⚠ Resume builder is under construction</div>
            <div className="text-pf-fg-muted mt-1">
              Check back soon for the full resume building experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
