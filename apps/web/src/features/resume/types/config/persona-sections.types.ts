/**
 * Tech Persona Section Configuration
 * Defines which sections are available based on user's tech persona
 */

import type { SectionId } from "./section-ids.types";

/**
 * Tech personas that have access to developer-specific sections
 */
export const DEV_PERSONAS = [
  "fullstack",
  "frontend",
  "backend",
  "mobile",
  "devops",
  "ai-ml",
  "data",
] as const;

export type DevPersona = (typeof DEV_PERSONAS)[number];

/**
 * Sections that are only available for developer personas
 */
export const DEV_ONLY_SECTIONS: SectionId[] = ["open-source", "hackathons", "bug-bounties"];

/**
 * Universal sections available to all tech professionals
 */
export const UNIVERSAL_SECTIONS: SectionId[] = [
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
  "interests",
  "recommendations",
  "achievements",
];

/**
 * Check if a tech persona is a developer persona
 */
export function isDevPersona(techPersona: string | null | undefined): boolean {
  if (!techPersona) return false;
  return DEV_PERSONAS.includes(techPersona as DevPersona);
}

/**
 * Get available sections based on tech persona
 */
export function getAvailableSections(techPersona: string | null | undefined): SectionId[] {
  if (isDevPersona(techPersona)) {
    return [...UNIVERSAL_SECTIONS, ...DEV_ONLY_SECTIONS];
  }
  return UNIVERSAL_SECTIONS;
}

/**
 * Check if a section is available for a given tech persona
 */
export function isSectionAvailable(
  sectionId: SectionId,
  techPersona: string | null | undefined
): boolean {
  if (DEV_ONLY_SECTIONS.includes(sectionId)) {
    return isDevPersona(techPersona);
  }
  return true;
}

/**
 * Filter sections based on tech persona
 */
export function filterSectionsByPersona<T extends { id: SectionId }>(
  sections: T[],
  techPersona: string | null | undefined
): T[] {
  return sections.filter((section) => isSectionAvailable(section.id, techPersona));
}

/**
 * Section metadata with labels and descriptions
 */
export const SECTION_METADATA: Record<
  SectionId,
  {
    label: string;
    description: string;
    devOnly: boolean;
  }
> = {
  header: {
    label: "Header",
    description: "Your name, title, and contact information",
    devOnly: false,
  },
  summary: {
    label: "Summary",
    description: "A brief overview of your professional profile",
    devOnly: false,
  },
  experiences: {
    label: "Experience",
    description: "Your work history and professional roles",
    devOnly: false,
  },
  education: {
    label: "Education",
    description: "Your academic background and qualifications",
    devOnly: false,
  },
  skills: {
    label: "Skills",
    description: "Your technical and professional skills",
    devOnly: false,
  },
  languages: {
    label: "Languages",
    description: "Languages you speak and your proficiency levels",
    devOnly: false,
  },
  certifications: {
    label: "Certifications",
    description: "Professional certifications and accreditations",
    devOnly: false,
  },
  projects: {
    label: "Projects",
    description: "Notable projects you've worked on",
    devOnly: false,
  },
  awards: {
    label: "Awards",
    description: "Recognition and awards you've received",
    devOnly: false,
  },
  publications: {
    label: "Publications",
    description: "Articles, papers, or books you've published",
    devOnly: false,
  },
  talks: {
    label: "Talks & Presentations",
    description: "Conferences and events where you've spoken",
    devOnly: false,
  },
  "open-source": {
    label: "Open Source",
    description: "Open source contributions and projects",
    devOnly: true,
  },
  hackathons: {
    label: "Hackathons",
    description: "Hackathons you've participated in or won",
    devOnly: true,
  },
  "bug-bounties": {
    label: "Bug Bounties",
    description: "Security vulnerabilities you've discovered",
    devOnly: true,
  },
  interests: {
    label: "Interests",
    description: "Your professional and personal interests",
    devOnly: false,
  },
  recommendations: {
    label: "Recommendations",
    description: "Testimonials from colleagues and managers",
    devOnly: false,
  },
  achievements: {
    label: "Achievements",
    description: "Notable accomplishments and milestones",
    devOnly: false,
  },
};
