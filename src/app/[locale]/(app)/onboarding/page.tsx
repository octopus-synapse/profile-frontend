/**
 * Onboarding Page
 * Complete wizard for new user profile setup
 */

import { Metadata } from "next";
import { OnboardingWizard } from "@/features/onboarding";

export const metadata: Metadata = {
  title: "Setup Your Profile | ProFile",
  description: "Complete your professional profile setup in minutes",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
