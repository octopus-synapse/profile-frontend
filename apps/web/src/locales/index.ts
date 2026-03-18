import type { Locale } from '@/config/i18n.config';

// Import translations statically for SSR support
import en from './en.json';
import ptBR from './pt-BR.json';

export type TranslationKeys = typeof en;

const translations: Record<Locale, TranslationKeys> = {
  en,
  'pt-BR': ptBR,
};

/**
 * Get translations for a specific locale
 * Works in both Server and Client components
 */
export function getTranslations(locale: Locale): TranslationKeys {
  return translations[locale] || translations.en;
}

/**
 * Type-safe translation getter with nested key support
 * @param t - Translation object
 * @param key - Dot-notation key path (e.g., 'hero.title')
 * @returns Translated string
 */
export function t<T extends TranslationKeys>(translations: T, key: string): string {
  const keys = key.split('.');
  let result: unknown = translations;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
  }

  return typeof result === 'string' ? result : key;
}

export { en, ptBR };
