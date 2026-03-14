/**
 * Admin Users Page (Server Component)
 */

import type { Metadata } from 'next';
import AdminUsersPage from './page.client';

export const metadata: Metadata = {
  title: 'User Management',
  description: 'Manage system users',
};

export default function Page() {
  return <AdminUsersPage />;
}
