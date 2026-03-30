'use client';

/**
 * Root Provider
 * Composes all providers in the correct order
 *
 * Note: Auth state is now managed directly via SDK hooks (useAuthSession)
 * No AuthProvider needed - QueryClient handles session caching
 */

import { Toaster, TooltipProvider } from '@octopus-synapse/profile-ui';
import { setApiLocale } from '@profile/api-client';
import { I18nProvider } from '@profile/i18n';
import type { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { SocketProvider } from './socket-provider';
import { ThemeProvider } from './theme-provider';

interface RootProviderProps {
  children: ReactNode;
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryProvider>
        <I18nProvider onLocaleChange={setApiLocale}>
          <SocketProvider>
            <TooltipProvider>
              {children}
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </SocketProvider>
        </I18nProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
