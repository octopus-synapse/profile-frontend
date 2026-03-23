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

import { authLogout, getAuthSessionQueryKey, useAuthSession } from '@profile/api-client';
import { type DictionaryKey, type LocaleInfo, useI18n } from '@profile/i18n';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalizedLink } from '@/shared/components/localized-link';
import { Avatar } from '@/shared/components/ui';
import { useThemeOptional } from '@/shared/providers/theme-provider';
import { cn } from '@/shared/utils';
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from './config/nav-items';

export function UserMenu() {
  const { t, language, setLanguage, locales } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useAuthSession();
  const user = data?.data?.user;
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
      <button
        type="button"
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors duration-150',
          'hover:bg-white/5',
          isOpen && 'bg-white/5',
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
      >
        <Avatar src={undefined} alt="" fallback={initials} size="sm" className="h-7 w-7" />
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-zinc-400 transition-transform duration-150',
            isOpen && 'rotate-180',
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]/95 py-1 shadow-xl"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="border-b border-white/10 bg-white/5 px-3 py-3">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-400">{user.email}</p>
          </div>

          {/* Navigation Items */}
          <div className="p-1">
            {USER_MENU_ITEMS.map((item) => (
              <LocalizedLink
                key={item.key}
                href={item.href}
                onClick={close}
                className="block rounded-lg px-3 py-2 text-sm text-white transition-colors duration-150 hover:bg-white/5"
                role="menuitem"
              >
                {t(item.labelKey as DictionaryKey)}
              </LocalizedLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="mx-1 border-t border-white/10" />
              <div className="p-1">
                <p className="px-3 py-1.5 text-[11px] font-medium tracking-wider text-zinc-500 uppercase">
                  {t('nav.userMenu.adminLabel')}
                </p>
                {ADMIN_MENU_ITEMS.map((item) => (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    className="block rounded-lg px-3 py-2 text-sm text-white transition-colors duration-150 hover:bg-white/5"
                    role="menuitem"
                  >
                    {t(item.labelKey as DictionaryKey)}
                  </LocalizedLink>
                ))}
              </div>
            </>
          )}

          {/* Preferences */}
          <div className="mx-1 border-t border-white/10" />
          <div className="p-1">
            {/* Theme */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-zinc-400">{t('nav.preferences.theme')}</span>
              <div className="flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5">
                <button
                  type="button"
                  onClick={() => themeContext?.setTheme('light')}
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150',
                    themeContext?.theme === 'light'
                      ? 'bg-[#0A0A0A]/95 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white',
                  )}
                  aria-label="Light theme"
                  aria-pressed={themeContext?.theme === 'light'}
                >
                  <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() => themeContext?.setTheme('dark')}
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150',
                    themeContext?.theme === 'dark'
                      ? 'bg-[#0A0A0A]/95 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white',
                  )}
                  aria-label="Dark theme"
                  aria-pressed={themeContext?.theme === 'dark'}
                >
                  <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-sm text-zinc-400">{t('nav.preferences.language')}</span>
              <div className="flex items-center gap-0.5 rounded-lg bg-white/5 p-0.5">
                {locales.map((locale: LocaleInfo) => (
                  <button
                    type="button"
                    key={locale.code}
                    onClick={() => setLanguage(locale.code)}
                    className={cn(
                      'flex h-6 items-center rounded-md px-2 text-xs font-medium transition-all duration-150',
                      language === locale.code
                        ? 'bg-[#0A0A0A]/95 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white',
                    )}
                    aria-pressed={language === locale.code}
                  >
                    {locale.code === 'pt-BR' ? 'PT' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="mx-1 border-t border-white/10" />
          <div className="p-1">
            <button
              type="button"
              onClick={() => {
                close();
                void handleSignOut();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 transition-colors duration-150 hover:bg-red-500/10"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              {t('nav.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
