'use client';

import { authLogout, getAuthSessionQueryKey, useAuthSession } from '@profile/api-client';
import { type LocaleInfo, useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { cn } from '@/shared/utils';
import { buildCommandGroups } from './build-command-groups';
import { CommandGroup } from './command-group';
import { CommandItem } from './command-item';
import type { CommandItem as CommandItemType } from './types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, language, setLanguage, locales } = useI18n();
  const { data } = useAuthSession();
  const user = data?.data?.user;
  const themeContext = useThemeOptional();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin;
  const hasCompletedOnboarding = user?.hasCompletedOnboarding;

  const handleSignOut = useCallback(async () => {
    await authLogout({});
    await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
    router.push('/');
    onClose();
  }, [queryClient, router, onClose]);

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  const toggleTheme = useCallback(() => {
    themeContext?.setTheme(themeContext.theme === 'dark' ? 'light' : 'dark');
    onClose();
  }, [themeContext, onClose]);

  const cycleLanguage = useCallback(() => {
    const currentIndex = locales.findIndex((l: LocaleInfo) => l.code === language);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    if (nextLocale) {
      setLanguage(nextLocale.code);
    }
    onClose();
  }, [language, locales, setLanguage, onClose]);

  const groups = useMemo(
    () =>
      buildCommandGroups({
        isAuthenticated,
        isAdmin: isAdmin ?? false,
        hasCompletedOnboarding: hasCompletedOnboarding ?? false,
        currentTheme: (themeContext?.theme === 'system' ? 'dark' : themeContext?.theme) ?? 'dark',
        currentLanguage: language,
        t,
        onToggleTheme: toggleTheme,
        onCycleLanguage: cycleLanguage,
        onSignOut: handleSignOut,
      }),
    [
      isAuthenticated,
      isAdmin,
      hasCompletedOnboarding,
      themeContext?.theme,
      language,
      t,
      toggleTheme,
      cycleLanguage,
      handleSignOut,
    ],
  );

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups;

    const lowerQuery = query.toLowerCase();

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  const flatItems = useMemo(() => filteredGroups.flatMap((g) => g.items), [filteredGroups]);

  const handleSelect = useCallback(
    (item: CommandItemType) => {
      if (item.href) {
        handleNavigate(item.href);
      } else if (item.action) {
        item.action();
      }
    },
    [handleNavigate],
  );

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i < flatItems.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i > 0 ? i - 1 : flatItems.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            handleSelect(flatItems[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, handleSelect, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  let itemIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          'relative w-full max-w-lg overflow-hidden rounded-xl',
          'border border-white/10 bg-[#0A0A0A]/95 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-150',
        )}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-zinc-500" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            aria-label="Search commands"
          />
          <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredGroups.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-zinc-500">No results found.</p>
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
                      onClick={() => handleSelect(item)}
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
