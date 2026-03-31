'use client';

/**
 * UserMenu Component
 *
 * Nielsen Heuristics Applied:
 * - User control and freedom (Escape to close, click outside)
 * - Consistency (familiar dropdown pattern)
 * - Flexibility (keyboard + mouse)
 * - Aesthetic and minimalist design
 * - Recognition over recall (clear labels and icons)
 */

import { Avatar, Button, cn } from '@octopus-synapse/profile-ui';
import {
  authLogout,
  getAuthSessionQueryKey,
  selectEnvelopeData,
  useAuthSession,
} from '@profile/api-client';
import { type DictionaryKey, type LocaleInfo, useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalizedLink } from '@/shared/components/localized-link';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from './config/nav-items';

export function UserMenu() {
  const { t, language, setLanguage, locales } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });
  const user = data?.user;
  const themeContext = useThemeOptional();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const handleSignOut = useCallback(async () => {
    await authLogout({});
    await queryClient.invalidateQueries({
      queryKey: getAuthSessionQueryKey(),
    });
    router.push('/');
  }, [queryClient, router]);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape, focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close]);

  if (!user) return null;

  // Use calculated field from backend
  const isAdmin = user.isAdmin;
  const displayName = user.name || user.email?.split('@')[0] || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <Button
        type="button"
        ref={triggerRef}
        variant="ghost"
        tone="neutral"
        size="sm"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
        rightIcon={
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 text-pf-fg-muted transition-transform duration-150',
              isOpen && 'rotate-180',
            )}
            strokeWidth={1.5}
          />
        }
        onPress={() => setIsOpen(!isOpen)}
      >
        <Avatar src={undefined} alt="" fallback={initials} size="sm" className="h-7 w-7" />
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-pf-border-default bg-pf-canvas-subtle/95 py-1 shadow-xl"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="border-b border-pf-border-default bg-pf-hover-subtle px-3 py-3">
            <p className="truncate text-sm font-medium text-pf-fg-default">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-pf-fg-muted">{user.email}</p>
          </div>

          {/* Navigation Items */}
          <div className="p-1">
            {USER_MENU_ITEMS.map((item) => (
              <LocalizedLink
                key={item.key}
                href={item.href}
                onClick={close}
                className="block rounded-lg px-3 py-2 text-sm text-pf-fg-default transition-colors duration-150 hover:bg-pf-hover-subtle"
                role="menuitem"
              >
                {t(item.labelKey as DictionaryKey)}
              </LocalizedLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="mx-1 border-t border-pf-border-default" />
              <div className="p-1">
                <p className="px-3 py-1.5 text-[11px] font-medium tracking-wider text-pf-fg-subtle uppercase">
                  {t('nav.userMenu.adminLabel')}
                </p>
                {ADMIN_MENU_ITEMS.map((item) => (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    className="block rounded-lg px-3 py-2 text-sm text-pf-fg-default transition-colors duration-150 hover:bg-pf-hover-subtle"
                    role="menuitem"
                  >
                    {t(item.labelKey as DictionaryKey)}
                  </LocalizedLink>
                ))}
              </div>
            </>
          )}

          {/* Preferences */}
          <div className="mx-1 border-t border-pf-border-default" />
          <div className="p-1">
            {/* Theme */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-pf-fg-muted">{t('nav.preferences.theme')}</span>
              <div className="flex items-center gap-0.5 rounded-lg bg-pf-hover-subtle p-0.5">
                <Button
                  type="button"
                  variant={themeContext?.theme === 'light' ? 'soft' : 'ghost'}
                  tone="neutral"
                  size="xs"
                  iconOnly
                  pressed={themeContext?.theme === 'light'}
                  aria-label={t('nav.aria.lightTheme')}
                  onPress={() => themeContext?.setTheme('light')}
                >
                  <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
                <Button
                  type="button"
                  variant={themeContext?.theme === 'dark' ? 'soft' : 'ghost'}
                  tone="neutral"
                  size="xs"
                  iconOnly
                  pressed={themeContext?.theme === 'dark'}
                  aria-label={t('nav.aria.darkTheme')}
                  onPress={() => themeContext?.setTheme('dark')}
                >
                  <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </Button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-pf-fg-muted">{t('nav.preferences.language')}</span>
              <div className="flex items-center gap-0.5 rounded-lg bg-pf-hover-subtle p-0.5">
                {locales.map((locale: LocaleInfo) => (
                  <Button
                    type="button"
                    key={locale.code}
                    variant={language === locale.code ? 'soft' : 'ghost'}
                    tone="neutral"
                    size="xs"
                    pressed={language === locale.code}
                    onPress={() => setLanguage(locale.code)}
                  >
                    {locale.code === 'pt-BR' ? 'PT' : 'EN'}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mx-1 border-t border-pf-border-default" />
          <div className="p-1">
            <Button
              type="button"
              variant="ghost"
              tone="danger"
              size="sm"
              fullWidth
              leftIcon={<LogOut className="h-4 w-4" strokeWidth={1.5} />}
              onPress={() => {
                close();
                void handleSignOut();
              }}
            >
              {t('nav.signOut')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
