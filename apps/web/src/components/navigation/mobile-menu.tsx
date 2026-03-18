'use client';

/**
 * MobileMenu Component - Spotlight Command Center
 *
 * Mobile menu with search bar (for app pages) or nav links (for landing).
 */

import { authLogout, getAuthSessionQueryKey, useAuthSession } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { Check, LogOut, Moon, Search, Sun, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { cn } from '@/shared/utils';
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
  const { data } = useAuthSession();
  const isAuthenticated = !!data?.data?.data?.user;
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

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menu.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menu.isOpen]);

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
      className="fixed inset-0 z-50 flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Header */}
      <header className="flex h-14 items-center justify-between border-b border-white/5 px-4 sm:px-6">
        <Logo />
        <button
          type="button"
          onClick={menu.close}
          className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-zinc-400 transition-colors duration-150 hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        {/* Navigation Links (for landing) or Search Button (for app) */}
        {hasCustomNavItems ? (
          <nav className="border-b border-white/5 py-4" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
            ))}
          </nav>
        ) : (
          <div className="border-b border-white/5 py-4">
            <button
              type="button"
              onClick={handleOpenSearch}
              className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Search className="h-5 w-5 text-zinc-500" strokeWidth={1.5} />
              <span className="text-sm text-zinc-500">Search anything...</span>
            </button>
          </div>
        )}

        {/* Preferences */}
        <div className="py-4">
          <p className="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">
            {t('nav.preferences.title')}
          </p>

          {/* Theme */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px] text-white">{t('nav.preferences.theme')}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => themeContext?.setTheme('light')}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150',
                  themeContext?.theme === 'light' ? 'bg-zinc-800 text-white' : 'text-zinc-500',
                )}
                aria-label="Light theme"
                aria-pressed={themeContext?.theme === 'light'}
              >
                <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => themeContext?.setTheme('dark')}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150',
                  themeContext?.theme === 'dark' ? 'bg-zinc-800 text-white' : 'text-zinc-500',
                )}
                aria-label="Dark theme"
                aria-pressed={themeContext?.theme === 'dark'}
              >
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-2">
            <span className="text-[15px] text-white">{t('nav.preferences.language')}</span>
            <div className="flex items-center gap-1">
              {locales.map((locale) => (
                <button
                  type="button"
                  key={locale.code}
                  onClick={() => setLanguage(locale.code)}
                  className={cn(
                    'flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors duration-150',
                    language === locale.code ? 'bg-zinc-800 text-white' : 'text-zinc-500',
                  )}
                  aria-pressed={language === locale.code}
                >
                  {locale.code === 'pt-BR' ? 'PT' : 'EN'}
                  {language === locale.code && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 p-4 sm:p-6">
        {isAuthenticated ? (
          <button
            type="button"
            onClick={() => {
              menu.close();
              void handleSignOut();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-md py-3 text-[15px] font-medium text-white transition-colors duration-150 hover:bg-zinc-900"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {t('nav.signOut')}
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              onClick={menu.close}
              className="flex w-full items-center justify-center rounded-md bg-white py-3 text-[15px] font-bold text-black transition-all duration-150 hover:bg-cyan-400"
            >
              {t('nav.getStarted')}
            </LocalizedLink>
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_IN}
              onClick={menu.close}
              className="flex w-full items-center justify-center py-3 text-[15px] text-zinc-400 transition-colors duration-150 hover:text-white"
            >
              {t('nav.signIn')}
            </LocalizedLink>
          </div>
        )}
      </footer>
    </div>
  );
}
