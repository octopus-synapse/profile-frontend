/**
 * Icon Catalog Contract Test
 *
 * Verifies that all lucide icon references in backend section types
 * exist in the installed lucide-react package.
 *
 * Detects stale icons after lucide-react upgrades.
 * Requires: backend running at BACKEND_URL or test seed data.
 */

import { describe, expect, it } from 'bun:test';
import { iconNames } from 'lucide-react/dynamic';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3001';
const validLucideIcons = new Set(iconNames as readonly string[]);

interface SectionTypeIcon {
  key: string;
  iconType: string;
  icon: string;
}

async function fetchSectionTypeIcons(): Promise<SectionTypeIcon[]> {
  const response = await fetch(`${BACKEND_URL}/api/v1/enums/section-types`);
  if (!response.ok) {
    throw new Error(`Failed to fetch section types: ${response.status}`);
  }
  const data = await response.json();
  return (data.data?.types ?? []).map((st: Record<string, unknown>) => ({
    key: st.key,
    iconType: st.iconType ?? 'emoji',
    icon: st.icon ?? '📄',
  }));
}

describe('Icon Catalog Contract', () => {
  it('all lucide icons in section types must exist in the installed package', async () => {
    const sectionTypes = await fetchSectionTypeIcons();
    const lucideTypes = sectionTypes.filter((st) => st.iconType === 'lucide');

    const invalidIcons = lucideTypes.filter((st) => !validLucideIcons.has(st.icon));

    expect(invalidIcons).toEqual([]);
  });
});
