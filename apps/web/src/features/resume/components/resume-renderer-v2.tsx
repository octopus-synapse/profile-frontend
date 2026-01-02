/**
 * Resume Renderer V2 - AST-based
 *
 * This renderer receives pre-compiled AST from the backend.
 * It does NOT interpret DSL or resolve tokens.
 *
 * Backend decides → Frontend renders
 */

"use client";

import type { ResumeAst } from "@octopus-synapse/profile-contracts";
import { RenderProvider, useRenderContext, usePageLayout, useGlobalStyles } from "./context";
import type { Resume } from "../types";

// Section components (to be refactored to use AST)
import {
  HeaderSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  SkillsSection,
  LanguagesSection,
  CertificationsSection,
  ProjectsSection,
} from "./sections";

interface ResumeRendererV2Props {
  resume: Resume;
  ast: ResumeAst;
  className?: string;
}

/**
 * Main entry point for AST-based resume rendering
 */
export function ResumeRendererV2({ resume, ast, className }: ResumeRendererV2Props) {
  return (
    <RenderProvider ast={ast}>
      <ResumeLayoutV2 resume={resume} className={className} />
    </RenderProvider>
  );
}

interface ResumeLayoutV2Props {
  resume: Resume;
  className?: string;
}

function ResumeLayoutV2({ resume, className }: ResumeLayoutV2Props) {
  const { sections } = useRenderContext();
  const page = usePageLayout();
  const globalStyles = useGlobalStyles();

  // Group sections by column
  const columnSections = page.columns.map((col) => ({
    column: col,
    sections: sections.filter((s) => s.columnId === col.id).sort((a, b) => a.order - b.order),
  }));

  // Check if multi-column
  const isMultiColumn = page.columns.length > 1;

  return (
    <div
      className={className}
      style={{
        width: `${page.widthMm}mm`,
        minHeight: `${page.heightMm}mm`,
        backgroundColor: globalStyles.background,
        color: globalStyles.textPrimary,
        paddingTop: `${page.marginTopMm}mm`,
        paddingBottom: `${page.marginBottomMm}mm`,
        paddingLeft: `${page.marginLeftMm}mm`,
        paddingRight: `${page.marginRightMm}mm`,
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {isMultiColumn ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: page.columns.map((col) => `${col.widthPercentage}%`).join(" "),
            gap: `${page.columnGapMm}mm`,
          }}
        >
          {columnSections.map(({ column, sections: colSections }) => (
            <div key={column.id}>
              {colSections.map((section) => (
                <SectionRenderer
                  key={section.sectionId}
                  sectionId={section.sectionId}
                  styles={section.styles}
                  resume={resume}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        // Single column
        sections
          .sort((a, b) => a.order - b.order)
          .map((section) => (
            <SectionRenderer
              key={section.sectionId}
              sectionId={section.sectionId}
              styles={section.styles}
              resume={resume}
            />
          ))
      )}
    </div>
  );
}

interface SectionRendererProps {
  sectionId: string;
  styles: ResumeAst["sections"][0]["styles"];
  resume: Resume;
}

/**
 * Renders individual sections with resolved styles from AST
 */
function SectionRenderer({ sectionId, styles, resume }: SectionRendererProps) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: styles.container.backgroundColor,
    borderColor: styles.container.borderColor,
    borderWidth: styles.container.borderWidthPx,
    borderRadius: styles.container.borderRadiusPx,
    padding: styles.container.paddingPx,
    marginBottom: styles.container.marginBottomPx,
    boxShadow: styles.container.shadow,
  };

  // TODO: Pass styles.title and styles.content to section components
  // once they are refactored to accept pre-resolved styles
  switch (sectionId) {
    case "header":
      return (
        <div style={containerStyle}>
          <HeaderSection resume={resume} />
        </div>
      );
    case "summary":
      return (
        <div style={containerStyle}>
          <SummarySection summary={resume.summary} />
        </div>
      );
    case "experiences":
      return (
        <div style={containerStyle}>
          <ExperienceSection experiences={resume.experiences ?? []} />
        </div>
      );
    case "education":
      return (
        <div style={containerStyle}>
          <EducationSection education={resume.educations ?? []} />
        </div>
      );
    case "skills":
      return (
        <div style={containerStyle}>
          <SkillsSection skills={resume.skills ?? []} />
        </div>
      );
    case "languages":
      return (
        <div style={containerStyle}>
          <LanguagesSection languages={resume.languages ?? []} />
        </div>
      );
    case "certifications":
      return (
        <div style={containerStyle}>
          <CertificationsSection
            certifications={resume.certifications ?? []}
          />
        </div>
      );
    case "projects":
      return (
        <div style={containerStyle}>
          <ProjectsSection projects={resume.projects ?? []} />
        </div>
      );
    default:
      return null;
  }
}
