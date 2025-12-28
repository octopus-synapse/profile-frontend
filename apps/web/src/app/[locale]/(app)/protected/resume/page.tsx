/**
 * Resume Page
 * Developer-inspired design with resume builder
 */

import { Metadata } from "next";
import { Code2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResumeBuilder } from "@/features/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Manage and customize your professional resume",
};

export default function ResumePage() {
  return (
    <div className="space-y-6">
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
          <span className="text-pf-fg-muted font-mono text-xs">// Resume Builder</span>
        </div>
        <h1 className="text-pf-fg-default mt-2 text-3xl font-bold">
          resume_builder<span className="text-pf-fg-muted font-normal">()</span>
        </h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Customize your resume with themes, preview in real-time, and export to PDF
        </p>
      </div>

      {/* Resume Builder */}
      <ResumeBuilder />
    </div>
  );
}
