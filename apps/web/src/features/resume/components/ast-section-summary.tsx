/**
 * AST Section Summary
 * Renders summary section from AST data
 */

"use client";

import type { PlacedSection, TextSectionData } from "@octopus-synapse/profile-contracts";

interface Props {
  section: PlacedSection;
}

export function ASTSectionSummary({ section }: Props) {
  const { data, styles } = section;

  if (data.type !== "summary") return null;

  const summaryData = data.data as TextSectionData;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform as any,
    marginBottom: "12px",
  };

  const contentStyle = {
    fontFamily: styles.content.fontFamily,
    fontSize: `${styles.content.fontSizePx}px`,
    lineHeight: styles.content.lineHeight,
    fontWeight: styles.content.fontWeight,
  };

  return (
    <section>
      <h3 style={titleStyle}>Summary</h3>
      <p style={contentStyle}>{summaryData.content}</p>
    </section>
  );
}
