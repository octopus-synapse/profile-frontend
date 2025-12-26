"use client";

/**
 * UserMenu Component
 * GitHub-style dropdown menu for authenticated users
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth";
import { useI18n } from "@/features/i18n";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";
import { Avatar } from "@/shared/components/ui";
import { cn } from "@/shared/utils";
import { ChevronDown, LogOut, Shield } from "lucide-react";
import { USER_MENU_ITEMS, ADMIN_MENU_ITEMS } from "../config/nav-items";

export function UserMenu() {
  const { t } = useI18n();
  const { user, signOut, hasRole } = useAuth();
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
          "flex items-center gap-1 rounded-full p-0.5 transition-colors",
          "hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-600 focus:outline-none",
          isOpen && "bg-zinc-800"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar src={user.image} alt={displayName} fallback={initials} size="sm" />
        <ChevronDown
          className={cn("h-4 w-4 text-zinc-400 transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-zinc-700 bg-zinc-900 shadow-lg ring-1 ring-black">
          {/* User Info Header */}
          <div className="border-b border-zinc-700 px-4 py-3">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-zinc-400">{user.email}</p>
            {user.username && <p className="mt-1 text-xs text-zinc-500">@{user.username}</p>}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {USER_MENU_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
              >
                {t(item.labelKey as DictionaryKey)}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="border-t border-zinc-700" />
              <div className="py-1">
                {ADMIN_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                  >
                    <Shield className="h-4 w-4 text-orange-500" />
                    {t(item.labelKey as DictionaryKey)}
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Sign Out */}
          <div className="border-t border-zinc-700">
            <button
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
