"use client";

/**
 * Logo Component
 * Developer-inspired design with Terminal icon
 */

import Link from "next/link";
import { Terminal } from "lucide-react";
import { ROUTES } from "@/config/routes";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showBadge?: boolean;
}

export function Logo({ className, variant = "dark", showBadge = true }: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link href={ROUTES.HOME} className={`flex items-center gap-2 ${className ?? ""}`}>
      <div
        className={`flex h-7 w-7 items-center justify-center ${
          isLight ? "bg-white text-[#0a0a0a]" : "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
        }`}
      >
        <Terminal className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <span
        className={`font-mono text-sm font-semibold ${isLight ? "text-white" : "text-pf-fg-default"}`}
      >
        profile
      </span>
      {showBadge && <span className="dev-badge">dev</span>}
    </Link>
  );
}
