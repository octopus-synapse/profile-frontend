/**
 * Admin Section Types Page (Server Component)
 */

import type { Metadata } from 'next';
import AdminSectionTypesPage from './page.client';

export const metadata: Metadata = {
  title: 'Section Types',
  description: 'Manage resume section type definitions',
};

export default function Page() {
  return <AdminSectionTypesPage />;
}
