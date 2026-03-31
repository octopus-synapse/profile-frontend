'use client';

/**
 * i18n Context and Provider
 * Handles language switching and translation lookup with dynamic imports
 */

import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { i18nConfig, type Locale } from './config';
import { type Dictionary, type DictionaryKey, en } from './dictionaries/en';

// ============================================================================
// Dictionary Loaders (Dynamic Imports)
// ============================================================================

const dictionaryLoaders: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en').then((mod) => mod.en),
  'pt-BR': () => import('./dictionaries/pt-BR').then((mod) => mod.ptBR as unknown as Dictionary),
  es: () => import('./dictionaries/es').then((mod) => mod.es as unknown as Dictionary),
};

// Cache for loaded dictionaries
const dictionaryCache: Partial<Record<Locale, Dictionary>> = {
  en, // Pre-load English as default
};

// ============================================================================
// Context Types
// ============================================================================

export interface LocaleInfo {
  code: Locale;
  label: string;
}

interface I18nContextValue {
  language: Locale;
  setLanguage: (lang: Locale) => void;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
  // Aliases for convenience
  locale: Locale;
  setLocale: (lang: Locale) => void;
  locales: LocaleInfo[];
  isLoading: boolean;
}

// ============================================================================
// Context
// ============================================================================

const I18nContext = createContext<I18nContextValue | null>(null);

// ============================================================================
// Provider
// ============================================================================

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
  /** Called when locale changes — wire to setApiLocale for Backend-Driven UI */
  onLocaleChange?: (locale: string) => void;
}

export function I18nProvider({ children, initialLocale, onLocaleChange }: I18nProviderProps) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get locale from URL params or use initial/default
  const urlLocale = params?.locale as Locale | undefined;
  const defaultLocale = initialLocale || urlLocale || i18nConfig.defaultLocale;

  const [language, setLanguageState] = useState<Locale>(defaultLocale);
  const [dictionary, setDictionary] = useState<Dictionary>(dictionaryCache[defaultLocale] || en);
  const [isLoading, setIsLoading] = useState(!dictionaryCache[defaultLocale]);

  // Load dictionary when language changes
  useEffect(() => {
    let cancelled = false;

    async function loadDictionary() {
      // Check cache first
      if (dictionaryCache[language]) {
        setDictionary(dictionaryCache[language]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const loaded = await dictionaryLoaders[language]();
        if (!cancelled) {
          dictionaryCache[language] = loaded;
          setDictionary(loaded);
        }
      } catch (error) {
        console.error(`Failed to load dictionary for ${language}:`, error);
        // Fallback to English
        if (!cancelled) {
          setDictionary(en);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDictionary();

    return () => {
      cancelled = true;
    };
  }, [language]);

  // Sync with URL locale
  useEffect(() => {
    if (urlLocale && urlLocale !== language && i18nConfig.locales.includes(urlLocale)) {
      setLanguageState(urlLocale);
    }
  }, [urlLocale, language]);

  // Backend-Driven UI: notify parent when locale changes
  useEffect(() => {
    onLocaleChange?.(language);
  }, [language, onLocaleChange]);

  const setLanguage = useCallback(
    (lang: Locale) => {
      if (!i18nConfig.locales.includes(lang)) {
        console.warn(`Invalid locale: ${lang}`);
        return;
      }

      setLanguageState(lang);

      // Update URL to reflect new locale
      if (pathname) {
        // Replace current locale in path with new locale
        const segments = pathname.split('/');
        if (segments[1] && i18nConfig.locales.includes(segments[1] as Locale)) {
          segments[1] = lang;
          const newPath = segments.join('/');
          router.push(newPath);
        }
      }
    },
    [pathname, router],
  );

  const t = useCallback(
    (key: DictionaryKey, params?: Record<string, string | number>): string => {
      let text: string = dictionary[key] ?? en[key] ?? key;

      // Replace params like {name} with actual values
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(value));
        });
      }

      return text;
    },
    [dictionary],
  );

  const locales: LocaleInfo[] = useMemo(
    () =>
      i18nConfig.locales.map((code) => ({
        code,
        label: i18nConfig.localeNames[code],
      })),
    [],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      // Aliases
      locale: language,
      setLocale: setLanguage,
      locales,
      isLoading,
    }),
    [language, setLanguage, t, locales, isLoading],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// ============================================================================
// Utility Hook for just translations
// ============================================================================

export function useT() {
  const { t } = useI18n();
  return t;
}
