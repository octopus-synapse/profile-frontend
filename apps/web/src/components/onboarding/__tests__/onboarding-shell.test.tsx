import React from 'react';
import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';
import { fireEvent, render, screen } from '@testing-library/react';
import { OnboardingShell } from '../onboarding-shell';
import { useOnboarding } from '../hooks';

void mock.module('../hooks', () => ({
  useOnboarding: mock(() => ({
    currentStep: 'review',
    currentStepIndex: 3,
    completedSteps: ['welcome', 'personal-info', 'username', 'optional-extra'],
    allSteps: [
      { id: 'welcome', label: 'Welcome', required: true },
      { id: 'personal-info', label: 'Personal info', required: true },
      { id: 'username', label: 'Username', required: true },
      { id: 'review', label: 'Review', required: true },
      { id: 'optional-extra', label: 'Optional extra', required: false },
      { id: 'complete', label: 'Complete', required: true },
    ],
    goToStep: mock(() => Promise.resolve()),
  })),
}));

describe('OnboardingShell', () => {
  beforeEach(() => {
    (useOnboarding as Mock<typeof useOnboarding>).mockClear();
  });

  it('allows navigating to accessible prior steps from the sidebar', () => {
    render(
      <OnboardingShell>
        <div>Content</div>
      </OnboardingShell>,
    );

    const onboardingState = (useOnboarding as Mock<typeof useOnboarding>).mock.results[0]?.value as { goToStep: Mock<() => Promise<void>> } | undefined;
    const goToStep = onboardingState?.goToStep;

    fireEvent.click(screen.getByRole('button', { name: 'Go to Personal info' }));

    expect(goToStep).toHaveBeenCalledWith('personal-info');
  });

  it('disables the current step button', () => {
    render(
      <OnboardingShell>
        <div>Content</div>
      </OnboardingShell>,
    );

    expect(
      (screen.getByRole('button', { name: 'Go to Review' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('disables steps that are not yet accessible', () => {
    render(
      <OnboardingShell>
        <div>Content</div>
      </OnboardingShell>,
    );

    expect(
      (screen.getByRole('button', { name: 'Go to Complete' }) as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('shows required progress without counting optional or complete steps', () => {
    render(
      <OnboardingShell>
        <div>Content</div>
      </OnboardingShell>,
    );

    expect(screen.getByText('3 of 4 required steps completed')).not.toBeNull();
  });
});
