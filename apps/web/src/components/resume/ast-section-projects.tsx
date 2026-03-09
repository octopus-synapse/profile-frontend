/**
 * AST Section Projects
 */

"use client";

import type { PlacedSection } from "@profile/api-client";

export function ASTSectionProjects({ section }: { section: PlacedSection }) {
 const { data, styles } = section;
 if (data.type !== "projects") return null;

 const titleStyle = {
  fontFamily: styles.title.fontFamily,
  fontSize: `${styles.title.fontSizePx}px`,
  fontWeight: styles.title.fontWeight,
 };

 return (
  <section>
   <h3 style={titleStyle}>Projects</h3>
   {/* TODO: Render project items */}
  </section>
 );
}
