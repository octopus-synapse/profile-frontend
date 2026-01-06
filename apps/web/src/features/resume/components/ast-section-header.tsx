/**
 * AST Section Header
 * Renders header section from AST data
 */

"use client";

import type { PlacedSection } from "@octopus-synapse/profile-contracts";

interface Props {
  section: PlacedSection;
}

interface HeaderData {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  links?: Array<{ url: string; label: string }>;
}

export function ASTSectionHeader({ section }: Props) {
  const { data, styles } = section;

  // Header section uses custom type for now
  if (data.type !== "custom") return null;

  const headerData = data.items[0] as unknown as HeaderData;
  const { fullName, jobTitle, email, phone, location, links } = headerData;

  const titleStyle = {
    fontFamily: styles.title.fontFamily,
    fontSize: `${styles.title.fontSizePx}px`,
    lineHeight: styles.title.lineHeight,
    fontWeight: styles.title.fontWeight,
    textTransform: styles.title.textTransform,
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
