"use client";

import { CtaGenericSection } from "./cta-generic-section";
import { useI18n } from "@profile/i18n";

export function CtaSection() {
 const { t } = useI18n();

 return (
  <CtaGenericSection
   title={t("landing.cta.title")}
   titleAccent={t("landing.cta.titleAccent")}
  />
 );
}
