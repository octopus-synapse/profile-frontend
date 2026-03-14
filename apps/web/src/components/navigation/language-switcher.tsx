'use client';

/**
 * LanguageSwitcher Component
 * Toggle between supported languages
 */

import { useI18n } from '@profile/i18n';
import { Globe } from 'lucide-react';
import { cn } from '@/shared/utils';

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale, locales } = useI18n();

  const currentLocale = locales.find((l) => l.code === locale);

  const toggleLocale = () => {
    const currentIndex = locales.findIndex((l) => l.code === locale);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    if (nextLocale) {
      setLocale(nextLocale.code);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-zinc-500',
        'transition-colors hover:bg-white/5 hover:text-white',
        className,
      )}
      title={`Switch to ${locales.find((l) => l.code !== locale)?.label}`}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{currentLocale?.code.split('-')[0]}</span>
    </button>
  );
}
