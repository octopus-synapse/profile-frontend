import { describe, expect, it } from 'bun:test';
import { shouldRedirectCompletedOnboarding } from '../onboarding-wizard.utils';

describe('onboarding-wizard utils', () => {
  it('redirects users who already completed onboarding and are not on the complete step', () => {
    expect(
      shouldRedirectCompletedOnboarding({
        hasCompletedOnboarding: true,
        currentStep: 'review',
      }),
    ).toBe(true);
  });

  it('does not redirect while the complete step is rendering', () => {
    expect(
      shouldRedirectCompletedOnboarding({
        hasCompletedOnboarding: true,
        currentStep: 'complete',
      }),
    ).toBe(false);
  });
});
