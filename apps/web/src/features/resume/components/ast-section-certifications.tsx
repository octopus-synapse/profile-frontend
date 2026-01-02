/**
 * AST Section Certifications
 */

"use client";

import type { PlacedSection } from "@octopus-synapse/profile-contracts";

export function ASTSectionCertifications({ section }: { section: PlacedSection }) {
  const { data, styles } = section;
  if (data.type !== "certifications") return null;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    fontWeight: styles.title.fontWeight,
  };

  return (
    <section>
      <h3 style={titleStyle}>Certifications</h3>
      {/* TODO: Render certification items */}
    </section>
  );
}
