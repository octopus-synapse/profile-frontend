'use client';

/**
 * Admin Section Types Page Client Component
 */

import { SectionTypesTable } from '@/components/admin';

export default function AdminSectionTypesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Section Types</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage resume section type definitions, translations, and icons
        </p>
      </div>

      <SectionTypesTable />
    </div>
  );
}
