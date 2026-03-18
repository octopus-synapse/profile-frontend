/**
 * Settings Page
 * Developer-inspired design with code aesthetic
 */

import type { Metadata } from 'next';
import { SettingsPage } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your profile, data, and preferences',
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
