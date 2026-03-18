/**
 * i18n core functionality.
 *
 * Provides type-safe translation functions with dot-notation key access.
 */

import { en } from './locales/en';
import { ptBR } from './locales/pt-BR';
import type { Translations } from './types';

export type Locale = 'en' | 'pt-BR';

const locales: Record<Locale, Translations> = {
  en,
  'pt-BR': ptBR,
};

let currentLocale: Locale = 'en';

/**
 * Set the current locale.
 */
export function setLocale(locale: Locale): void {
  if (!locales[locale]) {
    console.warn(`Locale "${locale}" not found, falling back to "en"`);
    currentLocale = 'en';
    return;
  }
  currentLocale = locale;
}

/**
 * Get the current locale.
 */
export function getLocale(): Locale {
  return currentLocale;
}

/**
 * Flatten nested object keys into dot-notation paths.
 * e.g., { common: { save: 'Save' } } -> 'common.save'
 */
type FlattenKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? FlattenKeys<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = FlattenKeys<Translations>;

/**
 * Get a translation by dot-notation key.
 *
 * @example
 * t('common.save') // "Save" or "Salvar"
 * t('auth.loginTitle') // "Welcome back" or "Bem-vindo de volta"
 */
export function t(key: TranslationKey): string {
  const translations = locales[currentLocale];
  const keys = key.split('.');

  let result: unknown = translations;
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key "${key}" not found for locale "${currentLocale}"`);
      return key;
    }
  }

  if (typeof result === 'string') {
    return result;
  }

  console.warn(`Translation key "${key}" did not resolve to a string`);
  return key;
}
