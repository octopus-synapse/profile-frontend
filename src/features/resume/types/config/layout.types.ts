/**
 * Layout Configuration Types
 * Defines page structure, columns, margins, and paper settings
 */

export type LayoutType =
  | "single-column"
  | "two-column"
  | "sidebar-left"
  | "sidebar-right"
  | "magazine"
  | "compact";

export type PaperSize = "a4" | "letter" | "legal";
export type MarginSize = "compact" | "normal" | "relaxed" | "wide";
export type ColumnDistribution = "60-40" | "70-30" | "65-35" | "50-50";
export type ColumnPosition = "main" | "sidebar" | "full-width";

export interface LayoutConfig {
  type: LayoutType;
  paperSize: PaperSize;
  margins: MarginSize;
  columnDistribution?: ColumnDistribution;
  pageBreakBehavior: "auto" | "section-aware" | "manual";
  showPageNumbers?: boolean;
  pageNumberPosition?: "bottom-center" | "bottom-right" | "top-right";
}

export const DEFAULT_LAYOUT: LayoutConfig = {
  type: "single-column",
  paperSize: "a4",
  margins: "normal",
  pageBreakBehavior: "section-aware",
  showPageNumbers: false,
};
