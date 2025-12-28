/**
 * Resume Layout Component
 * Handles single/two-column layouts
 */

"use client";

import { useStyleConfig } from "../context/style-context";
import {
  HeaderSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificationsSection,
  ProjectsSection,
} from "../sections";
import type { Resume } from "../../types";
import type { SectionConfig } from "../../types/config";
import { cn } from "@/shared/utils";

interface Props {
  resume: Resume;
  className?: string;
}

export function ResumeLayout({ resume, className }: Props) {
  const { config, colors, classes } = useStyleConfig();
  const { layout, sections } = config;

  const visibleSections = sections
    .filter((s: SectionConfig) => s.visible)
    .sort((a: SectionConfig, b: SectionConfig) => a.order - b.order);

  const isTwoColumn = layout.type === "two-column";
  const mainSections = visibleSections.filter(
    (s: SectionConfig) => s.column === "main" || s.column === "full-width"
  );
  const sidebarSections = visibleSections.filter((s: SectionConfig) => s.column === "sidebar");

  return (
    <div
      className={cn(
        "mx-auto min-h-[297mm] w-[210mm]",
        classes.shadow,
        classes.borderRadius,
        className
      )}
      style={{ backgroundColor: colors.background }}
    >
      {/* Header - always full width */}
      {visibleSections.find((s: SectionConfig) => s.id === "header") && (
        <HeaderSection resume={resume} />
      )}

      {/* Content */}
      <div className={cn(classes.padding, isTwoColumn && "grid grid-cols-[70%_30%] gap-6")}>
        {/* Main Column */}
        <div>
          {mainSections
            .filter((s: SectionConfig) => s.id !== "header")
            .map((section: SectionConfig) => renderSection(section.id, resume))}
        </div>

        {/* Sidebar (if two-column) */}
        {isTwoColumn && sidebarSections.length > 0 && (
          <aside style={{ borderLeft: `1px solid ${colors.divider}` }} className="pl-6">
            {sidebarSections.map((section: SectionConfig) => renderSection(section.id, resume))}
          </aside>
        )}
      </div>
    </div>
  );
}

function renderSection(id: string, resume: Resume) {
  switch (id) {
    case "summary":
      return <SummarySection key={id} summary={resume.summary} />;
    case "experiences":
      return <ExperienceSection key={id} experiences={resume.experiences ?? []} />;
    case "education":
      return <EducationSection key={id} education={resume.educations ?? []} />;
    case "skills":
      return <SkillsSection key={id} skills={resume.skills ?? []} />;
    case "languages":
      return <LanguagesSection key={id} languages={resume.languages ?? []} />;
    case "certifications":
      return <CertificationsSection key={id} certifications={resume.certifications ?? []} />;
    case "projects":
      return <ProjectsSection key={id} projects={resume.projects ?? []} />;
    default:
      return null;
  }
}
