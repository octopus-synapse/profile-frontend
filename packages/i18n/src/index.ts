/**
 * @profile/i18n
 *
 * Internationalization package for Profile.
 * Supports: English (en), Portuguese Brazil (pt-BR)
 *
 * Usage:
 *   // React hooks and provider
 *   import { I18nProvider, useI18n, useT, type Locale } from '@profile/i18n';
 *
 *   // Core utilities
 *   import { t, setLocale, getLocale } from '@profile/i18n';
 */

export { getLocale, setLocale, type TranslationKey, t } from './core';
// Core utilities (non-React)
export { en } from './locales/en';
export { ptBR } from './locales/pt-BR';
export type { DictionaryKey, Locale, LocaleInfo } from './react';

// React hooks and provider (Next.js compatible)
export {
  getLocaleFromHeaders,
  getLocaleFromPathname,
  I18nProvider,
  i18nConfig,
  useI18n,
  useT,
} from './react';
export type { Translations } from './types';
