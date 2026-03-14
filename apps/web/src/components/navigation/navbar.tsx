'use client';

/**
 * Navbar Component - Spotlight Command Center
 *
 * Minimalist navbar with central search trigger that opens a command palette.
 * For app pages: Logo | Search Trigger | User Avatar
 * For landing: Logo | Nav Links | Auth Buttons (traditional)
 */

import { useAuthSession } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { Menu, X } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { ROUTES } from '@/config/routes';
import { LocalizedLink } from '@/shared/components/localized-link';
import { cn } from '@/shared/utils';
import { CommandPalette } from './command-palette';
import type { NavItem } from './config/types';
import { useCommandPalette } from './hooks/use-command-palette';
import { useMobileMenu } from './hooks/use-mobile-menu';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { NavLink } from './nav-link';
import { SearchTrigger } from './search-trigger';
import { UserAvatar } from './user-avatar';

interface NavbarProps {
  className?: string;
  /** Custom navigation items - for landing page traditional nav links */
  navItems?: NavItem[];
  /** Custom center section content - overrides default nav/search */
  centerSection?: ReactNode;
  /** Custom right section content - overrides default auth buttons */
  rightSection?: ReactNode;
  /** Navbar variant for different styling */
  variant?: 'default' | 'landing';
  /** Handler for mobile demo button (Spark CTA landing) */
  onMobileDemo?: () => void;
}

export function Navbar({
  className,
  navItems,
  centerSection,
  rightSection,
  variant = 'default',
  onMobileDemo,
}: NavbarProps) {
  const { data, isLoading } = useAuthSession();
  const isAuthenticated = !!data?.data?.data?.user;
  const { t } = useI18n();
  const commandPalette = useCommandPalette();
  const mobileMenu = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLanding = variant === 'landing';
  const hasCustomNavItems = navItems && navItems.length > 0;

  return (
    <>
      <header
        className={cn(
          'z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md transition-all duration-300',
          isLanding ? 'fixed top-0 right-0 left-0' : 'sticky top-0',
          scrolled && 'bg-black/80 shadow-lg shadow-black/20',
          className,
        )}
      >
        <nav
          className={cn(
            'mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8',
            isLanding ? 'h-16 max-w-7xl' : 'h-14 max-w-screen-xl',
          )}
          aria-label="Main navigation"
        >
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Center Section */}
          <div className="hidden flex-1 justify-center md:flex">
            {centerSection ? (
              // Custom center section (e.g., SparkCTA for landing)
              centerSection
            ) : hasCustomNavItems ? (
              // Landing page: traditional nav links
              <div className="flex items-center gap-8">
                {navItems.map((item) => (
                  <NavLink key={item.key} item={item} />
                ))}
              </div>
            ) : (
              // App pages: search trigger for command palette
              <SearchTrigger onClick={commandPalette.open} className="max-w-sm" />
            )}
          </div>

          {/* Right Section */}
          <div className="flex shrink-0 items-center gap-3">
            {rightSection
              ? rightSection
              : !isLoading &&
                (isAuthenticated ? (
                  <UserAvatar />
                ) : (
                  <div className="flex items-center gap-3">
                    <LocalizedLink
                      href={ROUTES.AUTH.SIGN_IN}
                      className="hidden text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white sm:inline-flex"
                    >
                      {t('nav.signIn')}
                    </LocalizedLink>
                    <LocalizedLink
                      href={ROUTES.AUTH.SIGN_UP}
                      className="hidden rounded-md bg-white px-4 py-1.5 text-xs font-bold text-black transition-all hover:scale-[1.02] hover:bg-cyan-400 sm:inline-flex"
                    >
                      {t('nav.getStarted')}
                    </LocalizedLink>
                  </div>
                ))}

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={mobileMenu.toggle}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-zinc-400 transition-colors duration-150 hover:text-white md:hidden"
              aria-label={mobileMenu.isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenu.isOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenu.isOpen ? (
                <X className="h-5 w-5" strokeWidth={1.5} />
              ) : (
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Command Palette - only for app pages */}
      {!hasCustomNavItems && (
        <CommandPalette isOpen={commandPalette.isOpen} onClose={commandPalette.close} />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        menu={mobileMenu}
        navItems={navItems}
        onOpenCommandPalette={hasCustomNavItems || centerSection ? undefined : commandPalette.open}
        onOpenDemoModal={onMobileDemo}
      />
    </>
  );
}
