"use client";

/**
 * Navbar Component - PATCH Dark Theme
 *
 * Unified navbar for landing and app pages
 * Dark background with cyan accents - consistent with landing page design
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
          "z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-md transition-all duration-300",
          isLanding ? "fixed top-0 right-0 left-0" : "sticky top-0",
          scrolled && "bg-black/80 shadow-lg shadow-black/20",
          className
        )}
      >
        <nav
          className={cn(
            "mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8",
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
          <div className="flex items-center gap-3">
            {rightSection
              ? rightSection
              : !isLoading && (
                  <>
                    {isAuthenticated ? (
                      <UserMenu />
                    ) : (
                      <div className="flex items-center gap-3">
                        <LocalizedLink
                          href={ROUTES.AUTH.SIGN_IN}
                          className="hidden text-sm font-medium text-zinc-400 transition-colors duration-150 hover:text-white sm:inline-flex"
                        >
                          Sign in
                        </LocalizedLink>
                        <LocalizedLink
                          href={ROUTES.AUTH.SIGN_UP}
                          className="hidden rounded-md bg-white px-4 py-1.5 text-xs font-bold text-black transition-all hover:scale-[1.02] hover:bg-cyan-400 sm:inline-flex"
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
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md text-zinc-400 transition-colors duration-150 hover:text-white md:hidden"
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
