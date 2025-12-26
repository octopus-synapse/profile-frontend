"use client";

/**
 * NavLink Component
 * Navigation link with active state styling
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils";
import { useI18n } from "@/features/i18n";
import type { NavItem } from "../types";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";

interface NavLinkProps {
  item: NavItem;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ item, className, onClick }: NavLinkProps) {
  const { t } = useI18n();
  const pathname = usePathname();

  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white",
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span>{t(item.labelKey as DictionaryKey)}</span>
      {item.badge && (
        <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
