/**
 * Section IDs
 * All possible sections in a resume
 */

export type SectionId =
  | "header"
  | "summary"
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "projects"
  | "awards"
  | "publications"
  | "talks"
  | "open-source"
  | "hackathons"
  | "bug-bounties"
  | "interests"
  | "recommendations"
  | "achievements";

/** Sections that contain orderable items */
export type ListSectionId =
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "certifications"
  | "projects"
  | "awards"
  | "publications"
  | "talks"
  | "open-source"
  | "hackathons"
  | "bug-bounties"
  | "interests"
  | "recommendations"
  | "achievements";

/** Sections that are single blocks (no list items) */
export type SingleSectionId = "header" | "summary";

export const ALL_SECTION_IDS: SectionId[] = [
  "header",
  "summary",
  "experiences",
  "education",
  "skills",
  "languages",
  "certifications",
  "projects",
  "awards",
  "publications",
  "talks",
  "open-source",
  "hackathons",
  "bug-bounties",
  "interests",
  "recommendations",
  "achievements",
];
