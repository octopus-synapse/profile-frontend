/**
 * AST Section Experience
 * Renders experience section from AST data
 */

"use client";

import type {
  PlacedSection,
  ExperienceData,
  ExperienceItem,
} from "@octopus-synapse/profile-contracts";

interface Props {
  section: PlacedSection;
}

export function ASTSectionExperience({ section }: Props) {
  const { data, styles } = section;

  if (data.type !== "experience") return null;

  const experienceData = data.data as ExperienceData;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform as any,
    marginBottom: "16px",
  };

  const itemStyle = {
    fontFamily: styles.item.fontFamily,
    fontSize: `${styles.item.fontSizePx}px`,
    lineHeight: styles.item.lineHeight,
    marginBottom: "16px",
  };

  return (
    <section>
      <h3 style={titleStyle}>Experience</h3>
      {experienceData.items.map((item: ExperienceItem, idx: number) => (
        <div key={idx} style={itemStyle}>
          <div style={{ fontWeight: 600 }}>
            {item.position} at {item.company}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            {item.startDate} - {item.endDate || "Present"}
            {item.location && ` • ${item.location}`}
          </div>
          {item.description && <p style={{ marginTop: "8px" }}>{item.description}</p>}
          {item.achievements && item.achievements.length > 0 && (
            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
              {item.achievements.map((achievement, aIdx) => (
                <li key={aIdx}>{achievement}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}
