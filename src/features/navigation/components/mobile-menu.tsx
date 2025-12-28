"use client";

/**
 * MobileMenu Component
 * Developer-inspired full-screen overlay menu with terminal aesthetic
 */

import { X, Terminal, ArrowRight, Moon, Sun, Globe } from "lucide-react";
import { LocalizedLink } from "@/shared/components/localized-link";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/features/i18n";
import { useThemeOptional } from "@/shared/providers/theme-provider";
import { ROUTES } from "@/config/routes";
import { cn } from "@/shared/utils";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { useNavigation } from "../hooks/use-navigation";
import type { MobileMenuState } from "../types";

interface MobileMenuProps {
  menu: MobileMenuState;
}

export function MobileMenu({ menu }: MobileMenuProps) {
  const { isAuthenticated, signOut } = useAuth();
  const { language, setLanguage, locales } = useI18n();
  const themeContext = useThemeOptional();
  const { mainNavItems, adminNavItems, canAccessAdmin } = useNavigation();

  if (!menu.isOpen) return null;

  return (
    <div className="animate-in fade-in bg-pf-canvas-emphasis fixed inset-0 z-50 duration-300">
      {/* Header */}
      <div className="border-pf-border-muted flex items-center justify-between border-b border-white/10 px-6 py-4 lg:px-10">
        <Logo variant="light" showBadge={true} />
        <button
          onClick={menu.close}
          className="flex h-10 w-10 items-center justify-center text-white/80 transition-colors hover:text-white"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100vh-73px)] flex-col px-6 py-8 lg:px-10">
        {/* Terminal Header */}
        <div className="mb-6 flex items-center gap-2">
          <Terminal className="h-4 w-4 text-white/50" strokeWidth={1.5} />
          <span className="font-mono text-xs text-white/50">// navigation</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1">
          {/* Home Link */}
          <LocalizedLink
            href="/"
            onClick={menu.close}
            className="group flex items-center gap-4 py-3 font-mono text-lg text-white/60 transition-colors hover:text-white"
          >
            <span>home</span>
          </LocalizedLink>

          {/* Main Navigation */}
          {mainNavItems.map((item) => (
            <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
          ))}

          {/* Admin Navigation */}
          {canAccessAdmin && adminNavItems.length > 0 && (
            <>
              <div className="my-4 h-px bg-white/10" />
              <div className="mb-2 flex items-center gap-2">
                <span className="font-mono text-xs text-white/30">// admin</span>
              </div>
              {adminNavItems.map((item) => (
                <NavLink key={item.key} item={item} onClick={menu.close} variant="mobile" />
              ))}
            </>
          )}

          {/* Preferences Section */}
          <div className="my-4 h-px bg-white/10" />
          <div className="mb-2 flex items-center gap-2">
            <span className="font-mono text-xs text-white/30">// preferences</span>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {themeContext?.resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-white/60" strokeWidth={1.5} />
              ) : (
                <Sun className="h-4 w-4 text-white/60" strokeWidth={1.5} />
              )}
              <span className="font-mono text-sm text-white/60">theme</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => themeContext?.setTheme("light")}
                className={cn(
                  "px-3 py-1 font-mono text-xs transition-colors",
                  themeContext?.theme === "light"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                )}
              >
                light
              </button>
              <button
                onClick={() => themeContext?.setTheme("dark")}
                className={cn(
                  "px-3 py-1 font-mono text-xs transition-colors",
                  themeContext?.theme === "dark"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                )}
              >
                dark
              </button>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-white/60" strokeWidth={1.5} />
              <span className="font-mono text-sm text-white/60">language</span>
            </div>
            <div className="flex gap-1">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => setLanguage(locale.code)}
                  className={cn(
                    "px-3 py-1 font-mono text-xs transition-colors",
                    language === locale.code
                      ? "bg-white text-black"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {locale.code === "pt-BR" ? "PT" : locale.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="my-4 h-px bg-white/10" />
          {isAuthenticated ? (
            <button
              onClick={() => {
                menu.close();
                signOut();
              }}
              className="flex items-center py-3 font-mono text-lg text-white/60 transition-colors hover:text-white"
            >
              sign_out()
            </button>
          ) : (
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_IN}
              onClick={menu.close}
              className="flex items-center py-3 font-mono text-lg text-white/60 transition-colors hover:text-white"
            >
              sign_in()
            </LocalizedLink>
          )}
        </nav>

        {/* CTA Button */}
        {!isAuthenticated && (
          <div className="mt-auto pt-8">
            <LocalizedLink
              href={ROUTES.AUTH.SIGN_UP}
              onClick={menu.close}
              className="group inline-flex w-full items-center justify-center gap-2 bg-white px-6 py-3 font-mono text-sm text-black transition-opacity hover:opacity-90"
            >
              <Terminal className="h-4 w-4" strokeWidth={1.5} />
              get_started()
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </LocalizedLink>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center gap-2">
          <Terminal className="h-3 w-3 text-white/30" strokeWidth={1.5} />
          <span className="font-mono text-xs text-white/30">profile@v2.0.0</span>
        </div>
      </div>
    </div>
  );
}
