"use client";

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

import { useState, useRef, useEffect, useCallback } from "react";
import { LocalizedLink } from "@/shared/components/localized-link";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/features/i18n";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";
import { Avatar } from "@/shared/components/ui";
import { useThemeOptional } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/utils";
import { LogOut, Moon, Sun, ChevronDown } from "lucide-react";
import { USER_MENU_ITEMS, ADMIN_MENU_ITEMS } from "../config/nav-items";

export function UserMenu() {
  const { t, language, setLanguage, locales } = useI18n();
  const { user, signOut, hasRole } = useAuth();
  const themeContext = useThemeOptional();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, close]);

  // Close on Escape, focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  if (!user) return null;

  const isAdmin = hasRole("ADMIN");
  const displayName = user.name || user.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors duration-150",
          "hover:bg-pf-canvas-subtle",
          isOpen && "bg-pf-canvas-subtle"
        )}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
      >
        <Avatar src={user.image} alt="" fallback={initials} size="sm" className="h-7 w-7" />
        <ChevronDown
          className={cn(
            "text-pf-fg-muted h-3.5 w-3.5 transition-transform duration-150",
            isOpen && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="bg-pf-canvas-overlay border-pf-border-muted absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-xl border py-1 shadow-xl"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Info */}
          <div className="bg-pf-canvas-subtle border-pf-border-muted border-b px-3 py-3">
            <p className="text-pf-fg-default truncate text-sm font-medium">{displayName}</p>
            <p className="text-pf-fg-muted mt-0.5 truncate text-xs">{user.email}</p>
          </div>

          {/* Navigation Items */}
          <div className="p-1">
            {USER_MENU_ITEMS.map((item) => (
              <LocalizedLink
                key={item.key}
                href={item.href}
                onClick={close}
                className="text-pf-fg-default hover:bg-pf-canvas-subtle block rounded-lg px-3 py-2 text-sm transition-colors duration-150"
                role="menuitem"
              >
                {t(item.labelKey as DictionaryKey)}
              </LocalizedLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="border-pf-border-muted mx-1 border-t" />
              <div className="p-1">
                <p className="text-pf-fg-subtle px-3 py-1.5 text-[11px] font-medium tracking-wider uppercase">
                  Admin
                </p>
                {ADMIN_MENU_ITEMS.map((item) => (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    onClick={close}
                    className="text-pf-fg-default hover:bg-pf-canvas-subtle block rounded-lg px-3 py-2 text-sm transition-colors duration-150"
                    role="menuitem"
                  >
                    {t(item.labelKey as DictionaryKey)}
                  </LocalizedLink>
                ))}
              </div>
            </>
          )}

          {/* Preferences */}
          <div className="border-pf-border-muted mx-1 border-t" />
          <div className="p-1">
            {/* Theme */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-pf-fg-muted text-sm">Theme</span>
              <div className="bg-pf-canvas-subtle flex items-center gap-0.5 rounded-lg p-0.5">
                <button
                  onClick={() => themeContext?.setTheme("light")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150",
                    themeContext?.theme === "light"
                      ? "bg-pf-canvas-overlay text-pf-fg-default shadow-sm"
                      : "text-pf-fg-muted hover:text-pf-fg-default"
                  )}
                  aria-label="Light theme"
                  aria-pressed={themeContext?.theme === "light"}
                >
                  <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => themeContext?.setTheme("dark")}
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-md transition-all duration-150",
                    themeContext?.theme === "dark"
                      ? "bg-pf-canvas-overlay text-pf-fg-default shadow-sm"
                      : "text-pf-fg-muted hover:text-pf-fg-default"
                  )}
                  aria-label="Dark theme"
                  aria-pressed={themeContext?.theme === "dark"}
                >
                  <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between rounded-lg px-3 py-2">
              <span className="text-pf-fg-muted text-sm">Language</span>
              <div className="bg-pf-canvas-subtle flex items-center gap-0.5 rounded-lg p-0.5">
                {locales.map((locale) => (
                  <button
                    key={locale.code}
                    onClick={() => setLanguage(locale.code)}
                    className={cn(
                      "flex h-6 items-center rounded-md px-2 text-xs font-medium transition-all duration-150",
                      language === locale.code
                        ? "bg-pf-canvas-overlay text-pf-fg-default shadow-sm"
                        : "text-pf-fg-muted hover:text-pf-fg-default"
                    )}
                    aria-pressed={language === locale.code}
                  >
                    {locale.code === "pt-BR" ? "PT" : "EN"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="border-pf-border-muted mx-1 border-t" />
          <div className="p-1">
            <button
              onClick={() => {
                close();
                signOut();
              }}
              className="text-pf-danger-fg hover:bg-pf-danger-subtle flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors duration-150"
              role="menuitem"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
