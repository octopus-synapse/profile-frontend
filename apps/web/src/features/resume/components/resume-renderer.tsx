/**
 * Resume Renderer Component
 * Main component that renders the full resume with style config
 */

"use client";

import { StyleProvider } from "./context/style-context";
import { ResumeLayout } from "./layouts/resume-layout";
import type { Resume } from "../types";
import type { ResumeStyleConfig } from "../types/config";

interface Props {
  resume: Resume;
  styleConfig?: Partial<ResumeStyleConfig>;
  className?: string;
}

export function ResumeRenderer({ resume, styleConfig, className }: Props) {
  return (
    <StyleProvider config={styleConfig}>
      <ResumeLayout resume={resume} className={className} />
    </StyleProvider>
  );
}
