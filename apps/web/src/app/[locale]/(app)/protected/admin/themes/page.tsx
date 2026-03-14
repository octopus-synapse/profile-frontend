/**
 * Admin Theme Approvals Page (Server Component)
 */

import type { Metadata } from 'next';
import ThemeApprovalsClient from './page.client';

export const metadata: Metadata = {
  title: 'Theme Approvals | Admin',
  description: 'Review and approve user-submitted themes',
};

export default function Page() {
  return <ThemeApprovalsClient />;
}
