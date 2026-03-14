/**
 * i18n React hooks and provider
 */

export type { Locale } from '../config';
export {
  getLocaleFromHeaders,
  getLocaleFromPathname,
  i18nConfig,
} from '../config';
export type { LocaleInfo } from './context';
export { I18nProvider, useI18n, useT } from './context';
export type { DictionaryKey } from './dictionaries/en';
