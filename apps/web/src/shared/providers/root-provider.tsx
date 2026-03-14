'use client';

/**
 * Root Provider
 * Composes all providers in the correct order
 *
 * Note: Auth state is now managed directly via SDK hooks (useAuthSession)
 * No AuthProvider needed - QueryClient handles session caching
 */

import { setApiLocale } from '@profile/api-client';
import { I18nProvider } from '@profile/i18n';
import type { ReactNode } from 'react';
import { Toaster } from '@/shared/components/ui/toast';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryProvider>
        <I18nProvider onLocaleChange={setApiLocale}>
          <TooltipProvider>
            {children}
            <Toaster position="bottom-right" />
          </TooltipProvider>
        </I18nProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
