/**
 * Welcome Step
 *
 * Nielsen: Aesthetic and minimalist design
 * First impression with clear value proposition
 */

'use client';

import { useI18n } from '@profile/i18n';
import { Clock, Code, Shield, Sparkles } from 'lucide-react';
import { useOnboarding } from '../hooks';
import { OnboardingStepHeader } from '../step-header';
import { StepNavigation } from '../step-navigation';

export function WelcomeStep() {
  const { goToNextStep } = useOnboarding();
  const { t } = useI18n();

  const handleStartSetup = async () => {
    await goToNextStep();
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
          <Sparkles className="h-8 w-8" strokeWidth={1.5} />
        </div>
        <OnboardingStepHeader
          eyebrow={t('onboarding.welcome.eyebrow')}
          title={t('onboarding.welcome.title')}
          description={t('onboarding.welcome.description')}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <FeatureCard
          icon={<Code className="h-5 w-5" strokeWidth={1.5} />}
          title={t('onboarding.welcome.featureTechTitle')}
          description={t('onboarding.welcome.featureTechDescription')}
        />
        <FeatureCard
          icon={<Clock className="h-5 w-5" strokeWidth={1.5} />}
          title={t('onboarding.welcome.featureFastTitle')}
          description={t('onboarding.welcome.featureFastDescription')}
        />
        <FeatureCard
          icon={<Shield className="h-5 w-5" strokeWidth={1.5} />}
          title={t('onboarding.welcome.featureControlTitle')}
          description={t('onboarding.welcome.featureControlDescription')}
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-sm text-blue-400">
            i
          </span>
          <div className="text-sm text-zinc-400">
            <p>{t('onboarding.welcome.infoText')}</p>
            <p className="mt-2">
              <span className="font-medium text-white">{t('onboarding.welcome.requiredLabel')}</span>{' '}
              {t('onboarding.welcome.requiredItems')}
            </p>
            <p>
              <span className="font-medium text-white">{t('onboarding.welcome.optionalLabel')}</span>{' '}
              {t('onboarding.welcome.optionalItems')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleStartSetup} nextLabel={t('onboarding.welcome.startSetup')} canProceed={true} />
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-5">
      <div className="mb-3 text-blue-400">{icon}</div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
    </div>
  );
}
