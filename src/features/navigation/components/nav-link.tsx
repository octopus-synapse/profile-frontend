"use client";

/**
 * NavLink Component
 * Developer-inspired navigation link with monospace font
 */

import { usePathname } from "next/navigation";
import { LocalizedLink } from "@/shared/components/localized-link";
import { cn } from "@/shared/utils";
import { useI18n } from "@/features/i18n";
import type { NavItem } from "../types";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";

interface NavLinkProps {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  variant?: "desktop" | "mobile";
}

export function NavLink({ item, className, onClick, variant = "desktop" }: NavLinkProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  if (variant === "mobile") {
    return (
      <LocalizedLink
        href={item.href}
        onClick={onClick}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(
          "group flex items-center gap-4 py-3 font-mono text-lg transition-colors",
          isActive ? "text-pf-fg-on-emphasis" : "text-pf-fg-on-emphasis/60 hover:text-pf-fg-on-emphasis",
          className
        )}
      >
        {isActive && <span className="text-code-string text-xs">●</span>}
        <span>{t(item.labelKey as DictionaryKey).toLowerCase()}</span>
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
        "relative font-mono text-xs transition-colors",
        isActive ? "text-pf-fg-default" : "text-pf-fg-muted hover:text-pf-fg-default",
        className
      )}
    >
      {t(item.labelKey as DictionaryKey).toLowerCase()}
      {isActive && <span className="text-code-string ml-2 text-xs">●</span>}
    </LocalizedLink>
  );
}
