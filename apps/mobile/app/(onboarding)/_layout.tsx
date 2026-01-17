/**
 * Onboarding Layout
 * Stack navigator for onboarding flow
 */

import { Stack } from "expo-router";

export default function OnboardingLayout() {
 return (
  <Stack
   screenOptions={{
    headerShown: false,
    animation: "fade",
   }}
  />
 );
}
