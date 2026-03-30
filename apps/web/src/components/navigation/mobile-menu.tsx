'use client';

/**
 * MobileMenu Component - Spotlight Command Center
 *
 * Mobile menu with search bar (for app pages) or nav links (for landing).
 */

import { Button } from '@octopus-synapse/profile-ui';
import {
  authLogout,
  getAuthSessionQueryKey,
  selectEnvelopeData,
  useAuthSession,
} from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Check, LogOut, Moon, Search, Sun, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import type { MobileMenuState, NavItem } from './config/types';
import { Logo } from './logo';
import { NavLink } from './nav-link';

interface MobileMenuProps {
  menu: MobileMenuState;
  /** Custom navigation items - for landing page traditional nav links */
  navItems?: NavItem[];
  onOpenCommandPalette?: () => void;
}

export function MobileMenu({ menu, navItems, onOpenCommandPalette }: MobileMenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });
  const isAuthenticated = !!data?.user;
  const { t, language, setLanguage, locales } = useI18n();
  const themeContext = useThemeOptional();

  const hasCustomNavItems = navItems && navItems.length > 0;

  const handleSignOut = useCallback(async () => {
    await authLogout({});
    await queryClient.invalidateQueries({ queryKey: getAuthSessionQueryKey() });
    router.push('/');
  }, [queryClient, router]);

  const handleOpenSearch = useCallback(() => {
    menu.close();
    setTimeout(() => onOpenCommandPalette?.(), 100);
  }, [menu, onOpenCommandPalette]);

  // Close on Escape
  useEffect(() => {
    if (!menu.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        menu.close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menu.isOpen, menu]);

  if (!menu.isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="fixed inset-0 z-50 flex flex-col bg-pf-canvas-default"
      role="dialog"
      aria-modal="true"
      aria-label={t('nav.aria.navigationMenu')}
    >
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-pf-border-muted px-4 sm:px-6">
        <Logo />
        <span className="-mr-2">
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            emphasis="low"
            size="md"
            iconOnly
            aria-label={t('nav.aria.closeMenu')}
            onPress={menu.close}
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        {/* Navigation Links (for landing) or Search Button (for app) */}
        {hasCustomNavItems ? (
          <nav
            className="border-b border-pf-border-muted py-4"
            aria-label={t('nav.aria.mainNavigation')}
          >
            {navItems.map((item) => (
              <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
            ))}
          </nav>
        ) : (
          <div className="border-b border-pf-border-muted py-4">
            <Button
              type="button"
              variant="outline"
              tone="neutral"
              size="lg"
              fullWidth
              leftIcon={<Search className="h-5 w-5" strokeWidth={1.5} />}
              onPress={handleOpenSearch}
            >
              {t('nav.search.placeholder')}
            </Button>
          </div>
        )}

        {/* Preferences */}
        <div className="py-4">
          <p className="mb-3 text-xs font-medium tracking-wide text-pf-fg-subtle uppercase">
            {t('nav.preferences.title')}
          </p>

          {/* Theme */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px] text-pf-fg-default">{t('nav.preferences.theme')}</span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant={themeContext?.theme === 'light' ? 'soft' : 'ghost'}
                tone="neutral"
                size="sm"
                iconOnly
                pressed={themeContext?.theme === 'light'}
                aria-label={t('nav.aria.lightTheme')}
                onPress={() => themeContext?.setTheme('light')}
              >
                <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Button>
              <Button
                type="button"
                variant={themeContext?.theme === 'dark' ? 'soft' : 'ghost'}
                tone="neutral"
                size="sm"
                iconOnly
                pressed={themeContext?.theme === 'dark'}
                aria-label={t('nav.aria.darkTheme')}
                onPress={() => themeContext?.setTheme('dark')}
              >
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </Button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px] text-pf-fg-default">{t('nav.preferences.language')}</span>
            <div className="flex items-center gap-1">
              {locales.map((locale) => (
                <Button
                  type="button"
                  key={locale.code}
                  variant={language === locale.code ? 'soft' : 'ghost'}
                  tone="neutral"
                  size="sm"
                  pressed={language === locale.code}
                  rightIcon={
                    language === locale.code ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : undefined
                  }
                  onPress={() => setLanguage(locale.code)}
                >
                  {locale.code === 'pt-BR' ? 'PT' : 'EN'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-pf-border-muted p-4 sm:p-6">
        {isAuthenticated ? (
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            size="lg"
            fullWidth
            leftIcon={<LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />}
            onPress={() => {
              menu.close();
              void handleSignOut();
            }}
          >
            {t('nav.signOut')}
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              onClick={menu.close}
              className="flex w-full items-center justify-center rounded-md bg-pf-canvas-emphasis py-3 text-[15px] font-bold text-pf-fg-on-emphasis transition-all duration-150 hover:bg-pf-accent-fg"
            >
              {t('nav.getStarted')}
            </LocalizedLink>
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_IN}
              onClick={menu.close}
              className="flex w-full items-center justify-center py-3 text-[15px] text-pf-fg-muted transition-colors duration-150 hover:text-pf-fg-default"
            >
              {t('nav.signIn')}
            </LocalizedLink>
          </div>
        )}
      </footer>
    </div>
  );
}
