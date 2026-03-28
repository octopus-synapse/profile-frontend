/**
 * @profile/i18n
 *
 * Internationalization package for Profile.
 * Supports: English (en), Portuguese Brazil (pt-BR), Spanish (es)
 *
 * Usage:
 *   import { I18nProvider, useI18n, useT, type Locale } from '@profile/i18n';
 */

// Config (non-React — safe for middleware, server components)
export type { Locale } from './config';
export {
  getLocaleFromCountry,
  getLocaleFromHeaders,
  getLocaleFromPathname,
  hasLocalePrefix,
  i18nConfig,
  removeLocalePrefix,
} from './config';
// Dictionary types
export type { DictionaryKey } from './dictionaries/en';
// React Provider and hooks
export type { LocaleInfo } from './provider';
export { I18nProvider, useI18n, useT } from './provider';
