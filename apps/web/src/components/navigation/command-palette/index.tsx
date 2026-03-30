'use client';

import {
  authLogout,
  getAuthSessionQueryKey,
  type SearchResultItemDto,
  type SearchResultsResponseDto,
  selectEnvelopeData,
  useAuthSession,
  useSearchSearch,
} from '@profile/api-client';
import { type DictionaryKey, type LocaleInfo, useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { ExternalLink, Loader2, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { useBodyScrollLock } from '@/shared/hooks/use-body-scroll-lock';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { cn } from '@/shared/utils';
import { buildCommandGroups } from './build-command-groups';
import { CommandGroup } from './command-group';
import { CommandItem } from './command-item';
import type { CommandGroup as CommandGroupType, CommandItem as CommandItemType } from './types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t, language, setLanguage, locales } = useI18n();
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = data?.user;
  const themeContext = useThemeOptional();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [debouncedQuery, setDebouncedQuery] = useState('');

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  // Debounce query for API search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search users when query is >= 2 chars
  const userSearchQuery = useSearchSearch(
    {
      q: debouncedQuery,
      skills: '',
      location: '',
      minExp: '',
      maxExp: '',
      page: '1',
      limit: '5',
      sortBy: '',
    },
    {
      query: {
        enabled: isOpen && debouncedQuery.length >= 2,
        staleTime: 30000,
      },
    },
  );

  const searchData = userSearchQuery.data?.data?.data as SearchResultsResponseDto | undefined;
  const isSearching = userSearchQuery.isFetching;
  const searchResults = searchData?.data ?? [];

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

  // Build user search group
  const userGroup: CommandGroupType | null = useMemo(() => {
    if (searchResults.length === 0) return null;

    const items: CommandItemType[] = searchResults.map((result: SearchResultItemDto) => ({
      id: `user-${result.id}`,
      label: result.fullName || result.jobTitle || 'User',
      icon: User,
      href: `/protected/p/${result.slug || result.id}`,
      keywords: [result.fullName, result.jobTitle, result.slug].filter(Boolean) as string[],
    }));

    // Add "View all results" link if there are results
    if (searchResults.length > 0) {
      items.push({
        id: 'search-all',
        label: t('nav.search.viewAllResults' as DictionaryKey),
        icon: ExternalLink,
        href: `${ROUTES.PROTECTED.SEARCH}?q=${encodeURIComponent(debouncedQuery)}`,
        keywords: ['search', 'all', 'results'],
      });
    }

    return {
      id: 'users',
      label: t('nav.group.users' as DictionaryKey),
      items,
    };
  }, [searchResults, debouncedQuery, t]);

  const filteredGroups = useMemo(() => {
    const result: CommandGroupType[] = [];

    // Add user search results first if available
    if (userGroup) {
      result.push(userGroup);
    }

    if (!query.trim()) {
      return [...result, ...groups];
    }

    const lowerQuery = query.toLowerCase();

    const filteredCommandGroups = groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)),
        ),
      }))
      .filter((group) => group.items.length > 0);

    return [...result, ...filteredCommandGroups];
  }, [groups, query, userGroup]);

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
      setDebouncedQuery('');
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

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  let itemIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.aria.commandPalette')}
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
          'border border-pf-border-default bg-pf-canvas-subtle/95 shadow-2xl',
          'animate-in fade-in zoom-in-95 duration-150',
        )}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-pf-border-default px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-pf-fg-subtle" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t('nav.search.commandPlaceholder')}
            className="flex-1 bg-transparent text-sm text-pf-fg-default placeholder:text-pf-fg-subtle focus:outline-none"
            aria-label={t('nav.aria.searchCommands')}
          />
          <kbd className="rounded bg-pf-hover-default px-1.5 py-0.5 text-[10px] font-medium text-pf-fg-subtle">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {/* Loading indicator */}
          {isSearching && debouncedQuery.length >= 2 && (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-pf-fg-subtle">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t('nav.search.usersLoading' as DictionaryKey)}
            </div>
          )}

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
