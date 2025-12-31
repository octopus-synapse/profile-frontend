"use client";

/**
 * Logo Component
 * Sophisticated, minimal wordmark
 * Nielsen: Recognition over recall - simple, memorable identity
 */

import { LocalizedLink } from "@/shared/components/localized-link";
import { ROUTES } from "@/config/routes";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <LocalizedLink
      href={ROUTES.HOME}
      className={`group flex items-center ${className ?? ""}`}
      aria-label="Profile - Go to homepage"
    >
      <span className="text-foreground text-xl font-medium tracking-[-0.02em] transition-opacity duration-200 group-hover:opacity-70">
        profile
      </span>
    </LocalizedLink>
  );
}
