/**
 * SearchInput — input with suggestions dropdown.
 */

'use client';

import { useT } from '@profile/i18n';
import { Search, Sparkles, X } from 'lucide-react';
import type { RefObject } from 'react';

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  onShowSuggestions: (show: boolean) => void;
  onSelectSuggestion: (text: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function SearchInput({
  query,
  onQueryChange,
  suggestions,
  showSuggestions,
  onShowSuggestions,
  onSelectSuggestion,
  inputRef,
}: Props) {
  const t = useT();

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          onShowSuggestions(true);
        }}
        onFocus={() => onShowSuggestions(true)}
        onBlur={() => setTimeout(() => onShowSuggestions(false), 200)}
        placeholder={t('social.search.placeholder')}
        className="w-full rounded-xl border border-white/10 bg-[#0A0A0A]/80 py-3 pl-12 pr-10 text-sm text-white placeholder-zinc-500 outline-none ring-blue-500/40 transition-all focus:border-blue-500/40 focus:ring-2"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            onQueryChange('');
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-500 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-lg">
          {suggestions.map((text, idx) => (
            <li key={`suggestion-${idx}`}>
              <button
                type="button"
                onMouseDown={() => onSelectSuggestion(text)}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-300 hover:bg-white/5"
              >
                <Sparkles className="h-3 w-3 text-blue-400" />
                {text}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
