/**
 * Onboarding Page
 * Complete wizard for new user profile setup
 */

import type { Metadata } from 'next';
import { OnboardingWizard } from '@/components/onboarding';

export const metadata: Metadata = {
  title: 'Setup Your Profile | PATCH',
  description: 'Complete your professional profile setup on PATCH in minutes',
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
