/**
 * Modern Theme Preset
 */

import type { ResumeStyleConfig } from "../config";

export const MODERN_CONFIG: ResumeStyleConfig = {
  version: "1.0.0",
  layout: {
    type: "single-column",
    paperSize: "a4",
    margins: "normal",
    columnDistribution: "70-30",
    pageBreakBehavior: "section-aware",
    showPageNumbers: true,
    pageNumberPosition: "bottom-center",
  },
  tokens: {
    typography: {
      fontFamily: { heading: "inter", body: "inter" },
      fontSize: "base",
      headingStyle: "accent-border",
    },
    colors: {
      colors: {
        primary: "#3B82F6",
        secondary: "#64748B",
        background: "#FFFFFF",
        surface: "#F8FAFC",
        text: { primary: "#1E293B", secondary: "#64748B", accent: "#3B82F6" },
        border: "#E2E8F0",
        divider: "#F1F5F9",
      },
      borderRadius: "lg",
      shadows: "subtle",
      gradients: { enabled: true, direction: "to-right" },
    },
    spacing: {
      density: "comfortable",
      sectionGap: "lg",
      itemGap: "md",
      contentPadding: "md",
    },
  },
  sections: [
    { id: "header", visible: true, order: 0, column: "full-width", style: {} },
    { id: "summary", visible: true, order: 1, column: "main", style: {} },
    { id: "experiences", visible: true, order: 2, column: "main", style: {} },
    { id: "education", visible: true, order: 3, column: "main", style: {} },
    { id: "skills", visible: true, order: 4, column: "main", style: {} },
    { id: "projects", visible: true, order: 5, column: "main", style: {} },
    { id: "languages", visible: true, order: 6, column: "main", style: {} },
    { id: "certifications", visible: true, order: 7, column: "main", style: {} },
  ],
};

export const MODERN_METADATA = {
  name: "Modern",
  description: "Clean, contemporary design with vibrant colors and two-column layout.",
  category: "modern" as const,
  tags: ["clean", "professional", "tech", "two-column"],
};
