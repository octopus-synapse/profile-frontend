// nav-link.tsx
"use client";

/**
 * NavLink Component
 * Nielsen Heuristics Applied:
 * - Visibility of system status (clear active state)
 * - Consistency and standards (predictable behavior)
 * - Aesthetic and minimalist design
 */

import { usePathname } from "next/navigation";
import { LocalizedLink } from "@/shared/components/localized-link";
import { cn } from "@/shared/utils";
import { useI18n } from "@/features/i18n";
import { i18nConfig } from "@/config/i18n.config";
import type { NavItem } from "../types";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";

interface NavLinkProps {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

/**
 * Strip locale prefix from pathname for comparison
 */
function stripLocalePrefix(pathname: string): string {
  for (const locale of i18nConfig.locales) {
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1);
    }
    if (pathname === `/${locale}`) {
      return "/";
    }
  }
  return pathname;
}

export function NavLink({ item, className, onClick, variant = "desktop" }: NavLinkProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  // Strip locale prefix for comparison
  const normalizedPathname = stripLocalePrefix(pathname);

  const isActive =
    normalizedPathname === item.href ||
    (item.href !== "/" && normalizedPathname.startsWith(item.href));

  if (variant === "mobile") {
    return (
      <LocalizedLink
        href={item.href}
        onClick={onClick}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(
          "relative flex items-center gap-3 py-3 text-base transition-colors duration-150",
          isActive ? "text-pf-fg-default" : "text-pf-fg-muted active:text-pf-fg-default",
          className
        )}
        aria-current={isActive ? "page" : undefined}
      >
        {isActive && <span className="bg-pf-fg-default h-1.5 w-1.5 rounded-full" />}
        {t(item.labelKey as DictionaryKey)}
      </LocalizedLink>
    );
  }

  return (
    <LocalizedLink
      href={item.href}
      onClick={onClick}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={cn(
        "group relative px-3 py-2 text-sm font-medium transition-colors duration-150",
        isActive ? "text-pf-fg-default" : "text-pf-fg-muted hover:text-pf-fg-default",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {t(item.labelKey as DictionaryKey)}
      {/* Active indicator */}
      <span
        className={cn(
          "absolute inset-x-1 -bottom-[1px] h-[2px] rounded-full transition-all duration-200",
          isActive ? "bg-pf-fg-default" : "bg-pf-fg-default/40 scale-x-0 group-hover:scale-x-100"
        )}
      />
    </LocalizedLink>
  );
}
