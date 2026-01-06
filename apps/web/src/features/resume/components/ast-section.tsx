/**
 * AST Section Component
 * Renders a single section from AST
 */

"use client";

import type { PlacedSection } from "@octopus-synapse/profile-contracts";
import { ASTSectionHeader } from "./ast-section-header";
import { ASTSectionSummary } from "./ast-section-summary";
import { ASTSectionExperience } from "./ast-section-experience";
import { ASTSectionEducation } from "./ast-section-education";
import { ASTSectionSkills } from "./ast-section-skills";
import { ASTSectionLanguages } from "./ast-section-languages";
import { ASTSectionProjects } from "./ast-section-projects";
import { ASTSectionCertifications } from "./ast-section-certifications";

interface Props {
  section: PlacedSection;
}

export function ASTSection({ section }: Props) {
  const { data, styles } = section;

  // Container styles from AST
  const containerStyle = {
    backgroundColor: styles.container.backgroundColor,
    borderColor: styles.container.borderColor,
    borderWidth: `${styles.container.borderWidthPx}px`,
    borderRadius: `${styles.container.borderRadiusPx}px`,
    padding: `${styles.container.paddingPx}px`,
    marginBottom: `${styles.container.marginBottomPx}px`,
  };

  return (
    <div style={containerStyle}>
      {/* Render specific section type */}
      {data.type === "custom" && <ASTSectionHeader section={section} />}
      {data.type === "summary" && <ASTSectionSummary section={section} />}
      {data.type === "experience" && <ASTSectionExperience section={section} />}
      {data.type === "education" && <ASTSectionEducation section={section} />}
      {data.type === "skills" && <ASTSectionSkills section={section} />}
      {data.type === "languages" && <ASTSectionLanguages section={section} />}
      {data.type === "projects" && <ASTSectionProjects section={section} />}
      {data.type === "certifications" && <ASTSectionCertifications section={section} />}
    </div>
  );
}
