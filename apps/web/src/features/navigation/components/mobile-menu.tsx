"use client";

/**
 * MobileMenu Component
 *
 * Nielsen Heuristics Applied:
 * - User control and freedom (clear close action, gesture support)
 * - Visibility of system status (clear state indication)
 * - Aesthetic and minimalist design (focused content)
 * - Consistency (matches desktop navigation structure)
 * - Flexibility (touch-friendly targets, keyboard accessible)
 */

import { X, Moon, Sun, Check, LogOut } from "lucide-react";
import { LocalizedLink } from "@/shared/components/localized-link";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/features/i18n";
import { useThemeOptional } from "@/shared/providers/theme-provider";
import { ROUTES } from "@/config/routes";
import { cn } from "@/shared/utils";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { useNavigation } from "../hooks/use-navigation";
import type { MobileMenuState, NavItem } from "../types";
import { useEffect } from "react";

interface MobileMenuProps {
  menu: MobileMenuState;
  /** Custom navigation items - overrides default items from useNavigation */
  navItems?: NavItem[];
}

export function MobileMenu({ menu, navItems }: MobileMenuProps) {
  const { isAuthenticated, signOut } = useAuth();
  const { language, setLanguage, locales } = useI18n();
  const themeContext = useThemeOptional();
  const { mainNavItems, adminNavItems, canAccessAdmin } = useNavigation();

  // Use custom nav items if provided, otherwise use default from hook
  const displayNavItems = navItems ?? mainNavItems;

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menu.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu.isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!menu.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        menu.close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menu.isOpen, menu]);

  if (!menu.isOpen) return null;

  return (
    <div
      id="mobile-menu"
      className="bg-pf-canvas-default fixed inset-0 z-50 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      {/* Header */}
      <header className="border-pf-border-muted/70 flex h-14 items-center justify-between border-b px-4 sm:px-6">
        <Logo />
        <button
          onClick={menu.close}
          className="text-pf-fg-muted hover:text-pf-fg-default -mr-2 flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        {/* Main Navigation */}
        <nav className="border-pf-border-muted border-b py-4" aria-label="Main navigation">
          {displayNavItems.map((item) => (
            <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
          ))}
        </nav>

        {/* Admin Section */}
        {canAccessAdmin && adminNavItems.length > 0 && (
          <div className="border-pf-border-muted border-b py-4">
            <p className="text-pf-fg-muted mb-2 text-xs font-medium tracking-wide uppercase">
              Admin
            </p>
            {adminNavItems.map((item) => (
              <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
            ))}
          </div>
        )}

        {/* Preferences */}
        <div className="py-4">
          <p className="text-pf-fg-muted mb-3 text-xs font-medium tracking-wide uppercase">
            Preferences
          </p>

          {/* Theme */}
          <div className="flex items-center justify-between py-2">
            <span className="text-pf-fg-default text-[15px]">Theme</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => themeContext?.setTheme("light")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150",
                  themeContext?.theme === "light"
                    ? "bg-pf-canvas-subtle text-pf-fg-default"
                    : "text-pf-fg-muted"
                )}
                aria-label="Light theme"
                aria-pressed={themeContext?.theme === "light"}
              >
                <Sun className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => themeContext?.setTheme("dark")}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-150",
                  themeContext?.theme === "dark"
                    ? "bg-pf-canvas-subtle text-pf-fg-default"
                    : "text-pf-fg-muted"
                )}
                aria-label="Dark theme"
                aria-pressed={themeContext?.theme === "dark"}
              >
                <Moon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between py-2">
            <span className="text-pf-fg-default text-[15px]">Language</span>
            <div className="flex items-center gap-1">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => setLanguage(locale.code)}
                  className={cn(
                    "flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors duration-150",
                    language === locale.code
                      ? "bg-pf-canvas-subtle text-pf-fg-default"
                      : "text-pf-fg-muted"
                  )}
                  aria-pressed={language === locale.code}
                >
                  {locale.code === "pt-BR" ? "PT" : "EN"}
                  {language === locale.code && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-pf-border-muted border-t p-4 sm:p-6">
        {isAuthenticated ? (
          <button
            onClick={() => {
              menu.close();
              signOut();
            }}
            className="text-pf-fg-default hover:bg-pf-canvas-subtle flex w-full items-center justify-center gap-2 rounded-md py-3 text-[15px] font-medium transition-colors duration-150"
          >
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.5} />
            Sign out
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              onClick={menu.close}
              className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex w-full items-center justify-center rounded-xl py-3 text-[15px] font-semibold transition-opacity duration-150 hover:opacity-90"
            >
              Get started
            </LocalizedLink>
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_IN}
              onClick={menu.close}
              className="text-pf-fg-muted hover:text-pf-fg-default flex w-full items-center justify-center py-3 text-[15px] transition-colors duration-150"
            >
              Sign in
            </LocalizedLink>
          </div>
        )}
      </footer>
    </div>
  );
}
