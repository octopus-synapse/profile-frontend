/**
 * Settings page utilities - uses generic types since SDK types are weakly typed.
 * NO manual type imports - all data comes from SDK responses.
 */

export interface DynamicSettingsNavItem {
  key: string;
  label: string;
  description?: string;
  count: number;
  iconType: string;
  icon: string;
  hasSection: boolean;
}

export interface SectionCategories {
  existing: DynamicSettingsNavItem[];
  available: DynamicSettingsNavItem[];
}

function buildSectionItem(
  sectionType: Record<string, unknown>,
  sections: Array<Record<string, unknown>>,
): DynamicSettingsNavItem {
  const matchingSection = sections.find(
    (section) =>
      section.sectionTypeKey === sectionType.key ||
      (section.sectionType as Record<string, unknown> | undefined)?.key === sectionType.key,
  );
  const count = (matchingSection?.items as unknown[] | undefined)?.length ?? 0;

  return {
    key: sectionType.key as string,
    label: (sectionType.title as string) || (sectionType.key as string),
    description: sectionType.description as string | undefined,
    iconType: (sectionType.iconType as string) ?? 'emoji',
    icon: (sectionType.icon as string) ?? '📄',
    count,
    hasSection: !!matchingSection,
  };
}

export function buildDynamicSettingsNavItems(
  sectionTypes: Array<Record<string, unknown>>,
  sections: Array<Record<string, unknown>>,
): DynamicSettingsNavItem[] {
  return sectionTypes
    .filter((sectionType) => sectionType.isActive)
    .map((sectionType) => buildSectionItem(sectionType, sections));
}

export function categorizeSections(
  sectionTypes: Array<Record<string, unknown>>,
  sections: Array<Record<string, unknown>>,
): SectionCategories {
  const allItems = sectionTypes
    .filter((sectionType) => sectionType.isActive)
    .map((sectionType) => buildSectionItem(sectionType, sections));

  return {
    existing: allItems.filter((item) => item.hasSection),
    available: allItems.filter((item) => !item.hasSection),
  };
}
