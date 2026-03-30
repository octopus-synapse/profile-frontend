'use client';

import type { useI18n } from '@profile/i18n';
import { Loader2, Search } from 'lucide-react';
import type { RefObject } from 'react';
import { cn } from '@/shared/utils';
import { CommandGroup } from './command-group';
import { CommandItem } from './command-item';
import type { CommandGroup as CommandGroupType, CommandItem as CommandItemType } from './types';

type TFunction = ReturnType<typeof useI18n>['t'];

interface CommandPaletteContentProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  filteredGroups: CommandGroupType[];
  selectedIndex: number;
  isSearching: boolean;
  debouncedQuery: string;
  onSelect: (item: CommandItemType) => void;
  onClose: () => void;
  t: TFunction;
}

export function CommandPaletteContent({
  inputRef,
  query,
  onQueryChange,
  filteredGroups,
  selectedIndex,
  isSearching,
  debouncedQuery,
  onSelect,
  onClose,
  t,
}: CommandPaletteContentProps) {
  let itemIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.aria.commandPalette')}
    >
      <CommandPaletteBackdrop onClose={onClose} />
      <div
        className={cn(
          'relative w-full max-w-lg overflow-hidden rounded-xl',
          'border border-pf-border-default bg-pf-canvas-subtle/95 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-150',
        )}
      >
        <CommandPaletteInput
          inputRef={inputRef}
          query={query}
          onQueryChange={onQueryChange}
          t={t}
        />
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {isSearching && debouncedQuery.length >= 2 && <CommandPaletteLoading t={t} />}
          {filteredGroups.length === 0 && !isSearching ? (
            <p className="px-4 py-8 text-center text-sm text-pf-fg-subtle">
              {t('nav.search.noResults')}
            </p>
          ) : (
            filteredGroups.map((group) => (
              <CommandGroup key={group.id} label={group.label}>
                {group.items.map((item) => {
                  itemIndex++;
                  const currentIndex = itemIndex;
                  return (
                    <CommandItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      shortcut={item.shortcut}
                      isSelected={currentIndex === selectedIndex}
                      onClick={() => onSelect(item)}
                    />
                  );
                })}
              </CommandGroup>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CommandPaletteBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

interface CommandPaletteInputProps {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  t: TFunction;
}

function CommandPaletteInput({ inputRef, query, onQueryChange, t }: CommandPaletteInputProps) {
  return (
    <div className="flex items-center gap-3 border-b border-pf-border-default px-4 py-3">
      <Search className="h-5 w-5 shrink-0 text-pf-fg-subtle" strokeWidth={1.5} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={t('nav.search.commandPlaceholder')}
        className="flex-1 bg-transparent text-sm text-pf-fg-default placeholder:text-pf-fg-subtle focus:outline-none"
        aria-label={t('nav.aria.searchCommands')}
      />
      <kbd className="rounded bg-pf-hover-default px-1.5 py-0.5 text-[10px] font-medium text-pf-fg-subtle">
        ESC
      </kbd>
    </div>
  );
}

function CommandPaletteLoading({ t }: { t: TFunction }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-pf-fg-subtle">
      <Loader2 className="h-4 w-4 animate-spin" />
      {t('nav.search.usersLoading' as never)}
    </div>
  );
}
