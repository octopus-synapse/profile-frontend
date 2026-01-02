/**
 * AST Section Languages
 */

"use client";

import type { PlacedSection } from "@octopus-synapse/profile-contracts";

export function ASTSectionLanguages({ section }: { section: PlacedSection }) {
  const { data, styles } = section;
  if (data.type !== "languages") return null;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    fontWeight: styles.title.fontWeight,
  };

  return (
    <section>
      <h3 style={titleStyle}>Languages</h3>
      {/* TODO: Render language items */}
    </section>
  );
}
