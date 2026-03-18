'use client';

import { useCallback } from 'react';

interface LanguageSelectorProps {
  locale: string;
  className?: string;
}

export function LanguageSelector({ locale, className }: LanguageSelectorProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    window.location.href = `/${e.target.value}`;
  }, []);

  return (
    <select
      aria-label="Select language"
      className={className}
      defaultValue={locale}
      onChange={handleChange}
    >
      <option value="en">EN</option>
      <option value="pt-BR">PT</option>
      <option value="es">ES</option>
    </select>
  );
}
