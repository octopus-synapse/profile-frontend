/**
 * AST Section Experience
 * Renders experience section from AST data
 */

"use client";

import type {
  PlacedSection,
  ExperienceItem,
} from "@octopus-synapse/profile-contracts";

interface Props {
  section: PlacedSection;
}

export function ASTSectionExperience({ section }: Props) {
  const { data, styles } = section;

  if (data.type !== "experience") return null;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform as any,
    marginBottom: "16px",
  };

  const contentStyle = {
    fontFamily: styles.content.fontFamily,
    fontSize: `${styles.content.fontSizePx}px`,
    lineHeight: styles.content.lineHeight,
    marginBottom: "16px",
  };

  return (
    <section>
      <h3 style={titleStyle}>Experience</h3>
      {data.items.map((item: ExperienceItem, idx: number) => (
        <div key={idx} style={contentStyle}>
          <div style={{ fontWeight: 600 }}>
            {item.title} at {item.company}
          </div>
          <div style={{ fontSize: "14px", color: "#666" }}>
            {item.dateRange.startDate} -{" "}
            {item.dateRange.isCurrent ? "Present" : item.dateRange.endDate}
            {item.location?.city && ` • ${item.location.city}`}
            {item.location?.remote && " (Remote)"}
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
