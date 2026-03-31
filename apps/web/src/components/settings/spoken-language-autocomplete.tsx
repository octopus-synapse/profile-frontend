'use client';

/**
 * Spoken Language Autocomplete Component
 * Search and select spoken languages with dynamic "Other" option
 * Uses SDK hooks directly - no manual types
 */

import { Button } from '@octopus-synapse/profile-ui';
import { useSkillsSearchLanguagesByName } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Check, ChevronDown, Loader2, Search, X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/shared/utils/cn';

export interface SpokenLanguageAutocompleteProps {
  /** Selected language name */
  value?: string;
  /** Called when selection changes - language is raw API object */
  onValueChange?: (name: string, language?: Record<string, unknown>) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error state */
  error?: boolean;
  /** Additional class names */
  className?: string;
}

function getLanguageName(lang: Record<string, unknown>, locale: string): string {
  switch (locale) {
    case 'pt-BR':
      return (lang.namePtBr as string) || (lang.nameEn as string) || '';
    case 'es':
      return (lang.nameEs as string) || (lang.nameEn as string) || '';
    default:
      return (lang.nameEn as string) || '';
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

  // Use SDK hook for language search
  const searchQuery = useSkillsSearchLanguagesByName(
    { q: search || '', limit: '50' },
    {
      query: {
        enabled: true,
        staleTime: 60 * 1000,
      },
    },
  );
  const languages = (searchQuery.data?.data?.data?.languages ?? []) as Record<string, unknown>[];
  const isLoading = searchQuery.isFetching;

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
      .filter((lang) => (lang.code as string) !== 'other')
      .map((lang) => ({
        value: getLanguageName(lang, locale),
        label: getLanguageName(lang, locale),
        nativeName: lang.nativeName as string | undefined,
        code: lang.code as string,
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

  const handleSelect = (name: string, language?: Record<string, unknown>) => {
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
        <span className={cn('block w-full', className)}>
          <Button
            type="button"
            variant="outline"
            tone={error ? 'danger' : 'neutral'}
            size="md"
            fullWidth
            disabled={disabled}
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            rightIcon={<ChevronDown className="h-4 w-4 opacity-50" />}
          >
            <span className="flex flex-1 items-center justify-between">
              <span className={cn('flex-1 truncate text-left', !value && 'text-zinc-500')}>
                {value || labels.placeholder}
              </span>
              {value && !disabled && (
                <button type="button" onClick={handleClear} className="mr-2">
                  <X className="h-4 w-4 cursor-pointer opacity-50 hover:opacity-100" />
                </button>
              )}
            </span>
          </Button>
        </span>
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
                <Button
                  type="button"
                  key={option.code}
                  variant={value === option.label ? 'soft' : 'ghost'}
                  tone={value === option.label ? 'info' : 'neutral'}
                  size="sm"
                  fullWidth
                  leftIcon={
                    <Check
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        value === option.label ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  }
                  onPress={() => handleSelect(option.label, option.language)}
                >
                  <span className="flex flex-1 items-center justify-between overflow-hidden">
                    <span className="truncate text-left">{option.label}</span>
                    {option.nativeName && option.nativeName !== option.label && (
                      <span className="ml-2 text-xs text-zinc-400">{option.nativeName}</span>
                    )}
                  </span>
                </Button>
              ))}

              {/* Dynamic "Other" option - shows when search doesn't match */}
              {search.trim() && !searchMatchesExisting && (
                <span className="block border-t border-white/10">
                  <Button
                    type="button"
                    variant="ghost"
                    tone="info"
                    size="sm"
                    fullWidth
                    leftIcon={<span className="text-xs opacity-60">+</span>}
                    onPress={handleAddCustom}
                  >
                    {labels.addCustom}: &quot;{search.trim()}&quot;
                  </Button>
                </span>
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
