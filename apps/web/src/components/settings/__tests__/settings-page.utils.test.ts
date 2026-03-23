import { describe, expect, it } from 'bun:test';
import { buildDynamicSettingsNavItems } from '../settings-page.utils';

describe('buildDynamicSettingsNavItems', () => {
  it('keeps active backend-defined sections visible with their item counts', () => {
    const items = buildDynamicSettingsNavItems(
      [
        {
          id: 'work',
          key: 'work_experience_v1',
          semanticKind: 'experience',
          title: 'Work Experience',
          description: 'Your professional experience',
          label: 'Experience',
          isActive: true,
          maxItems: null,
          definition: { kind: 'list', fields: [] },
        },
        {
          id: 'education',
          key: 'education_v1',
          semanticKind: 'education',
          title: 'Education',
          description: 'Your educational background',
          isActive: true,
          maxItems: null,
          definition: { kind: 'list', fields: [] },
        },
        {
          id: 'disabled',
          key: 'disabled_v1',
          semanticKind: 'custom',
          title: 'Disabled Section',
          isActive: false,
          maxItems: null,
          definition: { kind: 'list', fields: [] },
        },
      ],
      [
        {
          id: 'resume-section-1',
          sectionTypeKey: 'work_experience_v1',
          semanticKind: 'experience',
          sectionType: null,
          items: [{ id: 'item-1' }] as never,
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
      },
      {
        key: 'education_v1',
        label: 'Education',
        description: 'Your educational background',
        iconType: 'emoji',
        icon: '📄',
        count: 0,
      },
    ]);
  });
});
