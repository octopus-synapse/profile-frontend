/**
 * AST Section Skills
 */

"use client";

import type { PlacedSection } from "@octopus-synapse/profile-contracts";

export function ASTSectionSkills({ section }: { section: PlacedSection }) {
  const { data, styles } = section;
  if (data.type !== "skills") return null;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    fontWeight: styles.title.fontWeight,
  };

  return (
    <section>
      <h3 style={titleStyle}>Skills</h3>
      {/* TODO: Render skill items */}
    </section>
  );
}
