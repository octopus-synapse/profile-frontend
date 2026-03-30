'use client';

import { useI18n } from '@profile/i18n';
import { CtaGenericSection } from './cta-generic-section';

export function CtaSection() {
  const { t } = useI18n();

  return (
    <CtaGenericSection title={t('landing.cta.title')} titleAccent={t('landing.cta.titleAccent')} />
  );
}
