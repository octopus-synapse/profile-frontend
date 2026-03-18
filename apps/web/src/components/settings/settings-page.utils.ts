import type { ResumeSection, SectionType } from './services/generic-sections-repository';

export interface DynamicSettingsNavItem {
  key: string;
  label: string;
  description?: string;
  count: number;
}

export function buildDynamicSettingsNavItems(
  sectionTypes: SectionType[],
  sections: ResumeSection[],
): DynamicSettingsNavItem[] {
  return sectionTypes
    .filter((sectionType) => sectionType.isActive)
    .map((sectionType) => ({
      key: sectionType.key,
      label: sectionType.title, // Use title as display name (e.g., "Education", "Work Experience")
      description: sectionType.description,
      count:
        sections.find(
          (section) =>
            section.sectionTypeKey === sectionType.key ||
            section.sectionType?.key === sectionType.key,
        )?.items.length ?? 0,
    }));
}
