'use client';

/**
 * Spoken Language Autocomplete Component
 * Search and select spoken languages with dynamic "Other" option
 */

import { useI18n } from '@profile/i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/shared/utils/cn';
import { useSearchSpokenLanguages } from './hooks';
import type { SpokenLanguageCatalog } from './types';

export interface SpokenLanguageAutocompleteProps {
  /** Selected language name */
  value?: string;
  /** Called when selection changes */
  onValueChange?: (name: string, language?: SpokenLanguageCatalog) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
}

function getLanguageName(lang: SpokenLanguageCatalog, locale: string): string {
  switch (locale) {
    case 'pt-BR':
      return lang.namePtBr;
    case 'es':
      return lang.nameEs;
    default:
      return lang.nameEn;
  }
}

export function SpokenLanguageAutocomplete({
  value,
  onValueChange,
  placeholder,
  disabled = false,
  error = false,
  className,
}: SpokenLanguageAutocompleteProps) {
  const { language: locale } = useI18n();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { data: languages = [], isLoading } = useSearchSpokenLanguages(search);

  // Translations based on locale
  const labels = React.useMemo(
    () => ({
      placeholder:
        placeholder || (locale === 'pt-BR' ? 'Selecione um idioma...' : 'Select a language...'),
      searchPlaceholder: locale === 'pt-BR' ? 'Buscar idioma...' : 'Search language...',
      noResults: locale === 'pt-BR' ? 'Nenhum idioma encontrado' : 'No language found',
      addCustom: locale === 'pt-BR' ? 'Adicionar' : 'Add',
      searching: locale === 'pt-BR' ? 'Buscando...' : 'Searching...',
    }),
    [locale, placeholder],
  );

  // Transform languages to options with localized names
  const options = React.useMemo(() => {
    return languages
      .filter((lang) => lang.code !== 'other') // Filter out "Other" - we handle it dynamically
      .map((lang) => ({
        value: getLanguageName(lang, locale),
        label: getLanguageName(lang, locale),
        nativeName: lang.nativeName,
        code: lang.code,
        language: lang,
      }));
  }, [languages, locale]);

  // Check if search matches any existing option
  const searchMatchesExisting = React.useMemo(() => {
    if (!search.trim()) return true;
    return options.some(
      (opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()) ||
        opt.nativeName?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  // Focus input when popover opens
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const handleSelect = (name: string, language?: SpokenLanguageCatalog) => {
    onValueChange?.(name, language);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange?.('', undefined);
    setSearch('');
  };

  const handleAddCustom = () => {
    if (search.trim()) {
      onValueChange?.(search.trim(), undefined);
      setOpen(false);
      setSearch('');
    }
  };

  const listboxId = React.useId();

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchLower) ||
        opt.nativeName?.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          className={cn(
            'flex h-10 w-full items-center justify-between px-3 py-2 text-left text-sm',
            'border border-white/10 bg-[#0A0A0A]/95',
            'font-mono text-white',
            'focus:border-cyan-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-red-500',
            className,
          )}
        >
          <span className={cn('flex-1 truncate', !value && 'text-zinc-500')}>
            {value || labels.placeholder}
          </span>
          <div className="ml-2 flex items-center gap-1">
            {value && !disabled && (
              <X
                className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'z-50 w-[--radix-popover-trigger-width] overflow-hidden p-0',
          'border border-white/10 bg-[#0A0A0A]/95 shadow-lg',
          'animate-in fade-in-0 zoom-in-95',
        )}
        align="start"
        sideOffset={4}
      >
        {/* Search Input */}
        <div className="flex items-center border-b border-white/10 px-3">
          <Search className="mr-2 h-4 w-4 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            className={cn(
              'flex h-10 w-full bg-transparent py-3 font-mono text-sm outline-none',
              'text-white placeholder:text-zinc-600',
            )}
            placeholder={labels.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
        </div>

        {/* Options List */}
        <div id={listboxId} role="listbox" className="max-h-[300px] overflow-y-auto p-1">
          {isLoading ? (
            <div className="py-6 text-center font-mono text-sm text-zinc-400">
              {labels.searching}
            </div>
          ) : (
            <>
              {/* Filtered language options */}
              {filteredOptions.map((option) => (
                <button
                  type="button"
                  key={option.code}
                  className={cn(
                    'relative flex w-full cursor-pointer items-center px-2 py-2 text-sm outline-none select-none',
                    'font-mono hover:bg-white/5',
                    value === option.label && 'bg-cyan-500/10',
                  )}
                  onClick={() => handleSelect(option.label, option.language)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4 flex-shrink-0',
                      value === option.label ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <div className="flex flex-1 items-center justify-between overflow-hidden">
                    <span className="truncate">{option.label}</span>
                    {option.nativeName && option.nativeName !== option.label && (
                      <span className="ml-2 text-xs text-zinc-400">{option.nativeName}</span>
                    )}
                  </div>
                </button>
              ))}

              {/* Dynamic "Other" option - shows when search doesn't match */}
              {search.trim() && !searchMatchesExisting && (
                <button
                  type="button"
                  className={cn(
                    'relative flex w-full cursor-pointer items-center px-2 py-2 text-sm outline-none select-none',
                    'border-t border-white/10 font-mono hover:bg-cyan-500/10',
                    'text-cyan-400',
                  )}
                  onClick={handleAddCustom}
                >
                  <span className="mr-2 text-xs opacity-60">+</span>
                  <span>
                    {labels.addCustom}: &quot;{search.trim()}&quot;
                  </span>
                </button>
              )}

              {/* No results message */}
              {filteredOptions.length === 0 && !search.trim() && (
                <div className="py-6 text-center font-mono text-sm text-zinc-400">
                  {labels.noResults}
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

SpokenLanguageAutocomplete.displayName = 'SpokenLanguageAutocomplete';
