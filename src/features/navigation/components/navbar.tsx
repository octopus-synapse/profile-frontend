"use client";

/**
 * Navbar Component
 * GitHub-inspired navigation bar
 */

import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuth } from "@/features/auth";
import { useT } from "@/features/i18n";
import { Button } from "@/shared/components/ui";
import { ROUTES } from "@/config/routes";
import { cn } from "@/shared/utils";
import { Logo } from "./logo";
import { NavLink } from "./nav-link";
import { UserMenu } from "./user-menu";
import { MobileMenu } from "./mobile-menu";
import { LanguageSwitcher } from "./language-switcher";
import { useNavigation } from "../hooks/use-navigation";
import { useMobileMenu } from "../hooks/use-mobile-menu";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const t = useT();
  const { isAuthenticated, isLoading } = useAuth();
  const { mainNavItems } = useNavigation();
  const mobileMenu = useMobileMenu();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/80",
          className
        )}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
          {/* Left Section: Logo + Main Nav */}
          <div className="flex items-center gap-6">
            <Logo />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-1">
              {mainNavItems.map((item) => (
                <NavLink key={item.key} item={item} />
              ))}
            </nav>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <LanguageSwitcher className="hidden sm:flex" />

            {/* Auth Actions */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <UserMenu />
                ) : (
                  <div className="hidden sm:flex sm:items-center sm:gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={ROUTES.AUTH.SIGN_IN}>{t("nav.signIn")}</Link>
                    </Button>
                    <Button size="sm" asChild>
                      <Link href={ROUTES.AUTH.SIGN_UP}>{t("nav.signUp")}</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={mobileMenu.toggle}
              className="flex items-center justify-center rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenu.isOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu menu={mobileMenu} />
    </>
  );
}
