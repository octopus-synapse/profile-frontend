"use client";

/**
 * Navbar Component
 *
 * Nielsen Heuristics Applied:
 * 1. Visibility of system status - scroll indicator, loading states
 * 2. Match between system and real world - familiar navigation patterns
 * 3. User control and freedom - clear navigation, easy access
 * 4. Consistency and standards - predictable placement and behavior
 * 5. Error prevention - clear clickable areas
 * 6. Recognition rather than recall - visible navigation items
 * 7. Flexibility and efficiency - keyboard accessible
 * 8. Aesthetic and minimalist design - clean, focused interface
 */

import { Menu, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
import type { NavItem } from "../types";

interface NavbarProps {
  className?: string;
  /** Custom navigation items - overrides default items from useNavigation */
  navItems?: NavItem[];
  /** Custom right section content - overrides default auth buttons */
  rightSection?: ReactNode;
  /** Navbar variant for different styling */
  variant?: "default" | "landing";
}

export function Navbar({ className, navItems, rightSection, variant = "default" }: NavbarProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { mainNavItems } = useNavigation();
  const mobileMenu = useMobileMenu();
  const [scrolled, setScrolled] = useState(false);

  // Use custom nav items if provided, otherwise use default from hook
  const displayNavItems = navItems ?? mainNavItems;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLanding = variant === "landing";

  return (
    <>
      <header
        className={cn(
          "bg-pf-canvas-default/80 border-pf-border-muted/70 z-50 w-full border-b backdrop-blur-xl transition-shadow duration-300",
          isLanding ? "fixed top-0 right-0 left-0" : "sticky top-0",
          scrolled ? "shadow-[var(--shadow-md)]" : "shadow-[var(--shadow-sm)]",
          className
        )}
      >
        <nav
          className={cn(
            "mx-auto flex items-center justify-between px-4 sm:px-6",
            isLanding ? "h-16 max-w-7xl" : "h-14 max-w-screen-xl"
          )}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation - Center */}
          <div className={cn("hidden items-center md:flex", isLanding ? "gap-8" : "gap-1")}>
            {displayNavItems.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {rightSection
              ? rightSection
              : !isLoading && (
                  <>
                    {isAuthenticated ? (
                      <UserMenu />
                    ) : (
                      <div className="flex items-center gap-1">
                        <LocalizedLink
                          href={ROUTES.AUTH.SIGN_IN}
                          className="text-pf-fg-muted hover:text-pf-fg-default hidden rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 sm:inline-flex"
                        >
                          Sign in
                        </LocalizedLink>
                        <LocalizedLink
                          href={ROUTES.AUTH.SIGN_UP}
                          className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-90 sm:inline-flex"
                        >
                          Get started
                        </LocalizedLink>
                      </div>
                    )}
                  </>
                )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={mobileMenu.toggle}
              className="text-pf-fg-muted hover:text-pf-fg-default -mr-2 flex h-10 w-10 items-center justify-center rounded-md transition-colors duration-150 md:hidden"
              aria-label={mobileMenu.isOpen ? "Close menu" : "Open menu"}
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

      <MobileMenu menu={mobileMenu} navItems={navItems} />
    </>
  );
}
