/**
 * AST Renderer
 * Pure rendering component - receives compiled AST, just renders
 * No decision logic, no style resolution, no config
 */

"use client";

import type { ResumeAst, PlacedSection } from "@octopus-synapse/profile-contracts";
import { ASTSection } from "./ast-section";
import { mmToPx } from "../utils/ast-dimensions";

interface Props {
  ast: ResumeAst;
  className?: string;
}

export function ASTRenderer({ ast, className }: Props) {
  const { page, sections, globalStyles } = ast;

  // Apply global styles
  const containerStyle = {
    backgroundColor: globalStyles.background,
    color: globalStyles.textPrimary,
    width: `${mmToPx(page.widthMm)}px`,
    minHeight: `${mmToPx(page.heightMm)}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Render columns */}
      {page.columns.length === 1 && page.columns[0] ? (
        <SingleColumnLayout column={page.columns[0]} sections={sections} />
      ) : page.columns.length > 1 ? (
        <TwoColumnLayout columns={page.columns} sections={sections} />
      ) : null}
    </div>
  );
}

/**
 * Single column layout
 */
function SingleColumnLayout({
  column,
  sections,
}: {
  column: ResumeAst["page"]["columns"][0];
  sections: PlacedSection[];
}) {
  const columnStyle = {
    width: "100%",
  };

  const columnSections = sections.filter((s) => s.columnId === column.id);

  return (
    <div style={columnStyle}>
      {columnSections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <ASTSection key={section.sectionId} section={section} />
        ))}
    </div>
  );
}

/**
 * Two column layout
 */
function TwoColumnLayout({
  columns,
  sections,
}: {
  columns: ResumeAst["page"]["columns"];
  sections: PlacedSection[];
}) {
  const containerStyle = {
    display: "flex",
    gap: "0px",
  };

  return (
    <div style={containerStyle}>
      {columns.map((column) => {
        const columnStyle = {
          width: `${column.widthPercentage}%`,
        };

        const columnSections = sections.filter((s) => s.columnId === column.id);

        return (
          <div key={column.id} style={columnStyle}>
            {columnSections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <ASTSection key={section.sectionId} section={section} />
              ))}
          </div>
        );
      })}
    </div>
  );
}
