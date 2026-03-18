export function shouldRedirectCompletedOnboarding(params: {
  hasCompletedOnboarding?: boolean;
  currentStep?: string;
}): boolean {
  return Boolean(params.hasCompletedOnboarding && params.currentStep !== 'complete');
}
