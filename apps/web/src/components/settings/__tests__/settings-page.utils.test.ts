import { describe, expect, it } from 'bun:test';
import { buildDynamicSettingsNavItems } from '../settings-page.utils';

function createSectionType(overrides: Record<string, unknown> & { id: string; key: string }): Record<string, unknown> {
  return {
    slug: overrides.key.replace(/_v\d+$/, '').replace(/_/g, '-'),
    semanticKind: 'generic',
    title: overrides.key,
    version: 1,
    description: '',
    label: overrides.key,
    noDataLabel: 'No items',
    placeholder: 'Add items...',
    addLabel: 'Add Item',
    iconType: 'emoji',
    icon: '📄',
    isActive: true,
    isSystem: false,
    isRepeatable: true,
    minItems: null,
    maxItems: null,
    definition: {},
    uiSchema: null,
    renderHints: {},
    fieldStyles: {},
    ...overrides,
  };
}

describe('buildDynamicSettingsNavItems', () => {
  it('keeps active backend-defined sections visible with their item counts', () => {
    const items = buildDynamicSettingsNavItems(
      [
        createSectionType({
          id: 'work',
          key: 'work_experience_v1',
          semanticKind: 'experience',
          title: 'Work Experience',
          description: 'Your professional experience',
          label: 'Experience',
        }),
        createSectionType({
          id: 'education',
          key: 'education_v1',
          semanticKind: 'education',
          title: 'Education',
          description: 'Your educational background',
        }),
        createSectionType({
          id: 'disabled',
          key: 'disabled_v1',
          semanticKind: 'custom',
          title: 'Disabled Section',
          isActive: false,
        }),
      ],
      [
        {
          id: 'resume-section-1',
          sectionTypeKey: 'work_experience_v1',
          semanticKind: 'experience',
          sectionType: null,
          items: [{ id: 'item-1' }],
          order: 0,
        },
      ],
    );

    expect(items).toEqual([
      {
        key: 'work_experience_v1',
        label: 'Work Experience',
        description: 'Your professional experience',
        iconType: 'emoji',
        icon: '📄',
        count: 1,
        hasSection: true,
      },
      {
        key: 'education_v1',
        label: 'Education',
        description: 'Your educational background',
        iconType: 'emoji',
        icon: '📄',
        count: 0,
        hasSection: false,
      },
    ]);
  });
});
