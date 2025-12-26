"use client";

/**
 * Root Provider
 * Composes all providers in the correct order
 */

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { I18nProvider } from "@/features/i18n";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/shared/components/ui/toast";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        <I18nProvider>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </I18nProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
