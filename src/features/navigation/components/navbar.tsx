"use client";

/**
 * Navbar Component
 * Developer-inspired navigation bar with terminal aesthetic
 */

import { Menu, Terminal } from "lucide-react";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/config/routes";
import { LocalizedLink } from "@/shared/components/localized-link";
import { cn } from "@/shared/utils";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { useNavigation } from "../hooks/use-navigation";
import { useMobileMenu } from "../hooks/use-mobile-menu";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { mainNavItems } = useNavigation();
  const mobileMenu = useMobileMenu();

  return (
    <>
      <header
        className={cn(
          "border-pf-border-muted bg-pf-canvas-default/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm",
          className
        )}
      >
        <div className="mx-auto flex h-14 items-center justify-between px-6 lg:px-10">
          {/* Left Section: Logo */}
          <Logo />

          {/* Center Section: Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            {mainNavItems.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </nav>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            {/* Auth Actions */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <>
                    <LocalizedLink
                      href={ROUTES.AUTH.SIGN_IN}
                      className="text-pf-fg-muted hover:text-pf-fg-default hidden font-mono text-xs transition-colors sm:block"
                    >
                      sign_in
                    </LocalizedLink>
                    <LocalizedLink
                      href={ROUTES.AUTH.SIGN_UP}
                      className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis hidden items-center gap-2 px-4 py-2 font-mono text-xs transition-opacity hover:opacity-90 sm:flex"
                    >
                      <Terminal className="h-3.5 w-3.5" strokeWidth={1.5} />
                      get_started
                    </LocalizedLink>
                  </>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={mobileMenu.toggle}
              className="text-pf-fg-default hover:text-pf-fg-muted flex h-9 w-9 items-center justify-center transition-colors lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenu.isOpen}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu menu={mobileMenu} />
    </>
  );
}
