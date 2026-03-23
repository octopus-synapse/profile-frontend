import type { ResumeSection, SectionType } from './services/generic-sections-repository';

export interface DynamicSettingsNavItem {
  key: string;
  label: string;
  description?: string;
  count: number;
  iconType: string;
  icon: string;
}

export function buildDynamicSettingsNavItems(
  sectionTypes: SectionType[],
  sections: ResumeSection[],
): DynamicSettingsNavItem[] {
  return sectionTypes
    .filter((sectionType) => sectionType.isActive)
    .map((sectionType) => ({
      key: sectionType.key,
      label: sectionType.title,
      description: sectionType.description,
      iconType: sectionType.iconType ?? 'emoji',
      icon: sectionType.icon ?? '📄',
      count:
        sections.find(
          (section) =>
            section.sectionTypeKey === sectionType.key ||
            section.sectionType?.key === sectionType.key,
        )?.items.length ?? 0,
    }));
}
