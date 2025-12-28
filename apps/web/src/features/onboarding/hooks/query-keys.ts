/**
 * Onboarding Query Keys
 */

export const onboardingKeys = {
  all: ["onboarding"] as const,
  status: () => [...onboardingKeys.all, "status"] as const,
  progress: () => [...onboardingKeys.all, "progress"] as const,
};
