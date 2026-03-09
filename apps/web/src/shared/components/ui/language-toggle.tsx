"use client";

/**
 * Language Toggle Component
 * Switch between supported languages
 */

import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/shared/utils";
import type { Locale } from "@/config/i18n.config";

interface LanguageToggleProps {
  className?: string;
  variant?: "buttons" | "dropdown";
}

export function LanguageToggle({ className, variant = "buttons" }: LanguageToggleProps) {
  const { language, setLanguage, locales } = useI18n();

  if (variant === "buttons") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {locales.map((locale) => (
          <button
            key={locale.code}
            onClick={() => setLanguage(locale.code)}
            className={cn(
              "px-2 py-1 font-mono text-xs transition-colors",
              language === locale.code
                ? "bg-white text-black"
                : "text-zinc-400 hover:bg-white/5 hover:text-white"
            )}
            title={locale.label}
          >
            {locale.code === "pt-BR" ? "PT" : locale.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe className="h-3.5 w-3.5 text-zinc-400" strokeWidth={1.5} />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Locale)}
        className={cn(
          "bg-transparent font-mono text-xs",
          "text-zinc-400 hover:text-white",
          "cursor-pointer focus:outline-none"
        )}
      >
        {locales.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Simple inline toggle for navbar - cycles through languages
export function LanguageToggleSimple({ className }: { className?: string }) {
  const { language, setLanguage, locales } = useI18n();

  const cycleLanguage = () => {
    const currentIndex = locales.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    if (nextLocale) {
      setLanguage(nextLocale.code);
    }
  };

  const currentLocale = locales.find((l) => l.code === language);
  const displayCode = language === "pt-BR" ? "PT" : language.toUpperCase();

  return (
    <button
      onClick={cycleLanguage}
      className={cn(
        "flex h-9 items-center gap-1.5 px-2 transition-colors",
        "text-zinc-400 hover:bg-white/5 hover:text-white",
        className
      )}
      title={`Language: ${currentLocale?.label || language}`}
    >
      <Globe className="h-4 w-4" strokeWidth={1.5} />
      <span className="font-mono text-xs">{displayCode}</span>
    </button>
  );
}
