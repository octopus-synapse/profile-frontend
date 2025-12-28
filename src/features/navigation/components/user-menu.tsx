"use client";

/**
 * UserMenu Component
 * Developer-inspired dropdown menu with terminal aesthetic
 */

import { useState, useRef, useEffect } from "react";
import { LocalizedLink } from "@/shared/components/localized-link";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/features/i18n";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";
import { Avatar } from "@/shared/components/ui";
import { useThemeOptional } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/utils";
import { ChevronDown, LogOut, Shield, Terminal, Moon, Sun, Globe } from "lucide-react";
import { USER_MENU_ITEMS, ADMIN_MENU_ITEMS } from "../config/nav-items";

export function UserMenu() {
  const { t, language, setLanguage, locales } = useI18n();
  const { user, signOut, hasRole } = useAuth();
  const themeContext = useThemeOptional();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

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
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 font-mono text-xs transition-colors",
          "text-pf-fg-muted hover:text-pf-fg-default",
          isOpen && "text-pf-fg-default"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar src={user.image} alt={displayName} fallback={initials} size="xs" />
        <span className="hidden sm:inline">{(displayName.split(" ")[0] ?? displayName).toLowerCase()}</span>
        <ChevronDown
          className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="border-pf-border-default bg-pf-canvas-overlay absolute right-0 z-50 mt-2 w-56 origin-top-right border shadow-lg">
          {/* User Info Header */}
          <div className="border-pf-border-default border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <Terminal className="text-pf-fg-muted h-3 w-3" strokeWidth={1.5} />
              <span className="text-pf-fg-muted font-mono text-xs">// user</span>
            </div>
            <p className="text-pf-fg-default mt-2 font-mono text-sm">{displayName}</p>
            <p className="text-pf-fg-muted truncate font-mono text-xs">{user.email}</p>
            {user.username && (
              <p className="text-pf-fg-subtle mt-1 font-mono text-xs">@{user.username}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {USER_MENU_ITEMS.map((item) => (
              <LocalizedLink
                key={item.key}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default block px-4 py-2 font-mono text-xs transition-colors"
              >
                {t(item.labelKey as DictionaryKey).toLowerCase()}
              </LocalizedLink>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="border-pf-border-default border-t" />
              <div className="py-1">
                {ADMIN_MENU_ITEMS.map((item) => (
                  <LocalizedLink
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors"
                  >
                    <Shield className="text-pf-attention-fg h-3.5 w-3.5" strokeWidth={1.5} />
                    {t(item.labelKey as DictionaryKey).toLowerCase()}
                  </LocalizedLink>
                ))}
              </div>
            </>
          )}

          {/* Preferences Section */}
          <div className="border-pf-border-default border-t">
            <div className="px-4 py-2">
              <span className="text-pf-fg-subtle font-mono text-xs">// preferences</span>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                {themeContext?.resolvedTheme === "dark" ? (
                  <Moon className="text-pf-fg-muted h-3.5 w-3.5" strokeWidth={1.5} />
                ) : (
                  <Sun className="text-pf-fg-muted h-3.5 w-3.5" strokeWidth={1.5} />
                )}
                <span className="text-pf-fg-muted font-mono text-xs">theme</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => themeContext?.setTheme("light")}
                  className={cn(
                    "px-2 py-1 font-mono text-xs transition-colors",
                    themeContext?.theme === "light"
                      ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
                      : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
                  )}
                >
                  light
                </button>
                <button
                  onClick={() => themeContext?.setTheme("dark")}
                  className={cn(
                    "px-2 py-1 font-mono text-xs transition-colors",
                    themeContext?.theme === "dark"
                      ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
                      : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
                  )}
                >
                  dark
                </button>
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex items-center justify-between px-4 py-2">
              <div className="flex items-center gap-2">
                <Globe className="text-pf-fg-muted h-3.5 w-3.5" strokeWidth={1.5} />
                <span className="text-pf-fg-muted font-mono text-xs">language</span>
              </div>
              <div className="flex gap-1">
                {locales.map((locale) => (
                  <button
                    key={locale.code}
                    onClick={() => setLanguage(locale.code)}
                    className={cn(
                      "px-2 py-1 font-mono text-xs transition-colors",
                      language === locale.code
                        ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
                        : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
                    )}
                  >
                    {locale.code === "pt-BR" ? "PT" : locale.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="border-pf-border-default border-t">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex w-full items-center gap-2 px-4 py-2 font-mono text-xs transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              sign_out()
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
