/**
 * AST Section Education
 */

"use client";

import type { PlacedSection } from "@profile/api-client";

export function ASTSectionEducation({ section }: { section: PlacedSection }) {
 const { data, styles } = section;
 if (data.type !== "education") return null;

 const titleStyle = {
  fontFamily: styles.title.fontFamily,
  fontSize: `${styles.title.fontSizePx}px`,
  fontWeight: styles.title.fontWeight,
 };

 return (
  <section>
   <h3 style={titleStyle}>Education</h3>
   {/* TODO: Render education items */}
  </section>
 );
}
