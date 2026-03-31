'use client';

import {
  authLogout,
  getAuthSessionQueryKey,
  selectEnvelopeData,
  useAuthSession,
} from '@profile/api-client';
import { type LocaleInfo, useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBodyScrollLock } from '@/shared/hooks/use-body-scroll-lock';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { buildCommandGroups } from './build-command-groups';
import { CommandPaletteContent } from './command-palette-content';
import type { CommandGroup as CommandGroupType, CommandItem as CommandItemType } from './types';
import { useCommandNavigation } from './use-command-navigation';
import { useCommandSearch } from './use-command-search';

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

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

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

  // Search hook
  const { debouncedQuery, isSearching, userGroup } = useCommandSearch({
    isOpen,
    query,
  });

  // Build command groups
  const groups = useGroups({
    user,
    themeContext,
    language,
    locales,
    t,
    setLanguage,
    queryClient,
    router,
    onClose,
  });

  // Filter and merge groups
  const filteredGroups = useMemo(() => {
    const result: CommandGroupType[] = [];

    if (userGroup) {
      result.push(userGroup);
    }

    if (!query.trim()) {
      return [...result, ...groups];
    }

    const lowerQuery = query.toLowerCase();
    const filtered = groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(lowerQuery) ||
            item.keywords?.some((k) => k.toLowerCase().includes(lowerQuery)),
        ),
      }))
      .filter((group) => group.items.length > 0);

    return [...result, ...filtered];
  }, [groups, query, userGroup]);

  const flatItems = useMemo(() => filteredGroups.flatMap((g) => g.items), [filteredGroups]);

  // Navigation hook
  const { selectedIndex, resetIndex } = useCommandNavigation({
    isOpen,
    flatItems,
    onSelect: handleSelect,
    onClose,
  });

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      resetIndex();
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen, resetIndex]);

  useBodyScrollLock(isOpen);

  if (!isOpen) return null;

  return (
    <CommandPaletteContent
      inputRef={inputRef}
      query={query}
      onQueryChange={handleQueryChange}
      filteredGroups={filteredGroups}
      selectedIndex={selectedIndex}
      isSearching={isSearching}
      debouncedQuery={debouncedQuery}
      onSelect={handleSelect}
      onClose={onClose}
      t={t}
    />
  );
}

// Extract groups building to reduce main component complexity
interface UseGroupsOptions {
  user: { isAdmin?: boolean | null; hasCompletedOnboarding?: boolean | null } | null | undefined;
  themeContext: ReturnType<typeof useThemeOptional>;
  language: string;
  locales: LocaleInfo[];
  t: ReturnType<typeof useI18n>['t'];
  setLanguage: ReturnType<typeof useI18n>['setLanguage'];
  queryClient: ReturnType<typeof useQueryClient>;
  router: ReturnType<typeof useRouter>;
  onClose: () => void;
}

function useGroups(options: UseGroupsOptions): CommandGroupType[] {
  const { user, themeContext, language, locales, t, setLanguage, queryClient, router, onClose } =
    options;

  const handleSignOut = useCallback(async () => {
    await authLogout({});
    await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
    router.push('/');
    onClose();
  }, [queryClient, router, onClose]);

  const toggleTheme = useCallback(() => {
    if (themeContext) {
      const newTheme = themeContext.theme === 'dark' ? 'light' : 'dark';
      themeContext.setTheme(newTheme as 'light' | 'dark');
    }
    onClose();
  }, [themeContext, onClose]);

  const cycleLanguage = useCallback(() => {
    const currentIndex = locales.findIndex((l) => l.code === language);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLocale = locales[nextIndex];
    if (nextLocale) {
      setLanguage(nextLocale.code);
    }
    onClose();
  }, [language, locales, setLanguage, onClose]);

  const currentTheme = themeContext?.theme === 'system' ? 'dark' : (themeContext?.theme ?? 'dark');

  return useMemo(
    () =>
      buildCommandGroups({
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin ?? false,
        hasCompletedOnboarding: user?.hasCompletedOnboarding ?? false,
        currentTheme: currentTheme as 'light' | 'dark',
        currentLanguage: language,
        t,
        onToggleTheme: toggleTheme,
        onCycleLanguage: cycleLanguage,
        onSignOut: handleSignOut,
      }),
    [user, currentTheme, language, t, toggleTheme, cycleLanguage, handleSignOut],
  );
}
