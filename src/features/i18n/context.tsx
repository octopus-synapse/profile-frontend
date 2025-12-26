"use client";

/**
 * i18n Context and Provider
 * Handles language switching and translation lookup
 */

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { en, type Dictionary, type DictionaryKey } from "./dictionaries/en";
import { ptBR } from "./dictionaries/pt-BR";
import { LANGUAGES, type SupportedLanguage } from "@/config/constants";

// ============================================================================
// Dictionaries Map
// ============================================================================

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  en,
  "pt-BR": ptBR as unknown as Dictionary,
};

// ============================================================================
// Context Types
// ============================================================================

interface LocaleInfo {
  code: SupportedLanguage;
  label: string;
}

interface I18nContextValue {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
  // Aliases for convenience
  locale: SupportedLanguage;
  setLocale: (lang: SupportedLanguage) => void;
  locales: LocaleInfo[];
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
  defaultLanguage?: SupportedLanguage;
}

export function I18nProvider({ children, defaultLanguage }: I18nProviderProps) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    if (defaultLanguage) return defaultLanguage;

    // Check localStorage on client
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("language") as SupportedLanguage | null;
      if (stored && LANGUAGES.SUPPORTED.includes(stored)) {
        return stored;
      }

      // Check browser language
      const browserLang = navigator.language;
      if (browserLang.startsWith("pt")) {
        return "pt-BR";
      }
    }

    return LANGUAGES.DEFAULT;
  });

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  }, []);

  const t = useCallback(
    (key: DictionaryKey, params?: Record<string, string | number>): string => {
      const dictionary = dictionaries[language];
      let text: string = dictionary[key] ?? dictionaries[LANGUAGES.DEFAULT][key] ?? key;

      // Replace params like {name} with actual values
      if (params) {
        Object.entries(params).forEach(([paramKey, value]) => {
          text = text.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(value));
        });
      }

      return text;
    },
    [language]
  );

  const locales: LocaleInfo[] = useMemo(
    () => [
      { code: "en", label: "English" },
      { code: "pt-BR", label: "Português" },
    ],
    []
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
    }),
    [language, setLanguage, t, locales]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
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
