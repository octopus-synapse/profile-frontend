/**
 * AST Renderer
 * Pure rendering component - receives compiled AST, just renders
 * No decision logic, no style resolution, no config
 */

"use client";

import type { ResumeAst, PlacedSection } from "@octopus-synapse/profile-contracts";
import { ASTSection } from "./ast-section";

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
    width: `${page.widthPx}px`,
    minHeight: `${page.heightPx}px`,
  };

  return (
    <div style={containerStyle} className={className}>
      {/* Render columns */}
      {page.columns.length === 1 ? (
        <SingleColumnLayout column={page.columns[0]} sections={sections} />
      ) : (
        <TwoColumnLayout columns={page.columns} sections={sections} />
      )}
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
    width: `${column.widthPx}px`,
    paddingLeft: `${column.paddingPx.left}px`,
    paddingRight: `${column.paddingPx.right}px`,
    paddingTop: `${column.paddingPx.top}px`,
    paddingBottom: `${column.paddingPx.bottom}px`,
  };

  const columnSections = sections.filter((s) => s.columnId === column.columnId);

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
          width: `${column.widthPx}px`,
          paddingLeft: `${column.paddingPx.left}px`,
          paddingRight: `${column.paddingPx.right}px`,
          paddingTop: `${column.paddingPx.top}px`,
          paddingBottom: `${column.paddingPx.bottom}px`,
        };

        const columnSections = sections.filter((s) => s.columnId === column.columnId);

        return (
          <div key={column.columnId} style={columnStyle}>
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
