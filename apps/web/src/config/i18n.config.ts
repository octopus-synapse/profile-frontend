/**
 * i18n Configuration
 * Centralized configuration for internationalization
 */

// Define locales first to avoid circular reference
const locales = ["en", "pt-BR", "es"] as const;

export type Locale = (typeof locales)[number];

export const i18nConfig = {
  defaultLocale: "en" as const,
  locales,
  localeNames: {
    en: "English",
    "pt-BR": "Portugues",
    es: "Espanol",
  } as const satisfies Record<Locale, string>,
  // Mapping of country codes to locales (for geo-detection)
  countryLocaleMap: {
    BR: "pt-BR",
    PT: "pt-BR",
    AO: "pt-BR", // Angola
    MZ: "pt-BR", // Mozambique
    ES: "es",
    MX: "es",
    AR: "es",
    CO: "es",
    PE: "es",
    VE: "es",
    CL: "es",
    EC: "es",
    GT: "es",
    CU: "es",
    BO: "es",
    DO: "es",
    HN: "es",
    PY: "es",
    SV: "es",
    NI: "es",
    CR: "es",
    PA: "es",
    UY: "es",
    // All other countries default to English
  } as Record<string, Locale>,
} as const;

/**
 * Get locale from Accept-Language header
 */
export function getLocaleFromHeaders(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return i18nConfig.defaultLocale;

  // Parse Accept-Language header
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const parts = lang.trim().split(";q=");
      const code = parts[0] ?? "";
      const q = parts[1] ?? "1";
      return { code: code.trim().toLowerCase(), quality: parseFloat(q) };
    })
    .sort((a, b) => b.quality - a.quality);

  // Find first matching locale
  for (const { code } of languages) {
    // Exact match
    if (i18nConfig.locales.includes(code as Locale)) {
      return code as Locale;
    }
    // pt -> pt-BR
    if (code === "pt") return "pt-BR";
    // en-US, en-GB -> en
    if (code.startsWith("en")) return "en";
    // es-MX, es-AR -> es
    if (code.startsWith("es")) return "es";
  }

  return i18nConfig.defaultLocale;
}

/**
 * Get locale from country code (geo-detection)
 */
export function getLocaleFromCountry(countryCode: string | null): Locale {
  if (!countryCode) return i18nConfig.defaultLocale;
  return i18nConfig.countryLocaleMap[countryCode.toUpperCase()] || i18nConfig.defaultLocale;
}

/**
 * Check if a path already has a locale prefix
 */
export function hasLocalePrefix(pathname: string): boolean {
  return i18nConfig.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocalePrefix(pathname: string): string {
  for (const locale of i18nConfig.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale | null {
  for (const locale of i18nConfig.locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return null;
}
