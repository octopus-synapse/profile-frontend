/**
 * Locale Layout
 * Handles locale-specific providers and validation
 */

import { i18nConfig, type Locale } from '@profile/i18n/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return i18nConfig.locales.map((locale: Locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!i18nConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  return <>{children}</>;
}
