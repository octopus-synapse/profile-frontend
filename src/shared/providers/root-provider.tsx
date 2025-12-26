"use client";

/**
 * Root Provider
 * Composes all providers in the correct order
 */

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { I18nProvider } from "@/features/i18n";
import { AuthProvider } from "@/features/auth";

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <I18nProvider>{children}</I18nProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
