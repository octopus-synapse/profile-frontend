"use client";

/**
 * MobileMenu Component
 * Full-screen mobile navigation menu
 */

import { X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { useT } from "@/features/i18n";
import { Avatar, Button } from "@/shared/components/ui";
import { ROUTES } from "@/config/routes";
import { NavLink } from "./nav-link";
import { useNavigation } from "../hooks/use-navigation";
import type { MobileMenuState } from "../types";

interface MobileMenuProps {
  menu: MobileMenuState;
}

export function MobileMenu({ menu }: MobileMenuProps) {
  const t = useT();
  const { user, isAuthenticated, signOut } = useAuth();
  const { mainNavItems, adminNavItems, canAccessAdmin } = useNavigation();

  if (!menu.isOpen) return null;

  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={menu.close}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
          <span className="text-lg font-semibold text-white">Menu</span>
          <button
            onClick={menu.close}
            className="rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        {/* User Info (if authenticated) */}
        {isAuthenticated && user && (
          <div className="border-b border-zinc-800 px-4 py-4">
            <div className="flex items-center gap-3">
              <Avatar src={user.image} alt={displayName} fallback={initials} size="md" />
              <div>
                <p className="font-medium text-white">{displayName}</p>
                <p className="text-sm text-zinc-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.key}
                item={item}
                onClick={menu.close}
                className="w-full justify-start"
              />
            ))}
          </div>

          {/* Admin Navigation */}
          {canAccessAdmin && adminNavItems.length > 0 && (
            <>
              <div className="my-4 border-t border-zinc-800" />
              <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                {t("nav.group.admin")}
              </p>
              <div className="space-y-1">
                {adminNavItems.map((item) => (
                  <NavLink
                    key={item.key}
                    item={item}
                    onClick={menu.close}
                    className="w-full justify-start"
                  />
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Footer Actions */}
        <div className="border-t border-zinc-800 p-4">
          {isAuthenticated ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                menu.close();
                signOut();
              }}
            >
              {t("nav.signOut")}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href={ROUTES.AUTH.SIGN_IN} onClick={menu.close}>
                  {t("nav.signIn")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={ROUTES.AUTH.SIGN_UP} onClick={menu.close}>
                  {t("nav.signUp")}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
