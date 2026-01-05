/**
 * AST Section Header
 * Renders header section from AST data
 */

"use client";

import type { PlacedSection, HeaderData } from "@octopus-synapse/profile-contracts";

interface Props {
  section: PlacedSection;
}

export function ASTSectionHeader({ section }: Props) {
  const { data, styles } = section;

  if (data.type !== "header") return null;

  const headerData = data.data as HeaderData;
  const { fullName, jobTitle, email, phone, location, links } = headerData;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform as any,
    textDecoration: styles.title.textDecoration,
  };

  const contentStyle = {
    fontFamily: styles.content.fontFamily,
    fontSize: `${styles.content.fontSizePx}px`,
    lineHeight: styles.content.lineHeight,
    fontWeight: styles.content.fontWeight,
  };

  return (
    <header>
      {fullName && <h1 style={titleStyle}>{fullName}</h1>}
      {jobTitle && <h2 style={contentStyle}>{jobTitle}</h2>}

      <div style={contentStyle}>
        {email && <div>{email}</div>}
        {phone && <div>{phone}</div>}
        {location && <div>{location}</div>}

        {links && links.length > 0 && (
          <div>
            {links.map((link: { url: string; label: string }, idx: number) => (
              <a key={idx} href={link.url} style={{ marginRight: "16px" }}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
