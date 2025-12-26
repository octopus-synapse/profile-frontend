"use client";

/**
 * Logo Component
 * Application logo with link to home
 */

import Link from "next/link";
import { ROUTES } from "@/config/routes";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href={ROUTES.HOME}
      className={`flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-80 ${className ?? ""}`}
    >
      <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="currentColor" />
        <path d="M8 10h4v12H8V10zm6 0h4v12h-4V10zm6 0h4v12h-4V10z" fill="#0d1117" />
      </svg>
      <span className="hidden sm:inline">Profile</span>
    </Link>
  );
}
