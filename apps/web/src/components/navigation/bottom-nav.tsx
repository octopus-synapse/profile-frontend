'use client';

/**
 * BottomNav - Mobile bottom navigation bar
 * Fixed navigation for quick access on mobile devices
 */

import { selectEnvelopeData, useAuthSession } from '@profile/api-client';
import { removeLocalePrefix, useI18n } from '@profile/i18n';
import { FileText, Home, MessageCircle, Search, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { cn } from '@/shared/utils';

const BOTTOM_NAV_ITEMS = [
  { key: 'home', href: ROUTES.PROTECTED.ROOT, icon: Home, labelKey: 'nav.home' as const },
  { key: 'resume', href: ROUTES.PROTECTED.RESUME, icon: FileText, labelKey: 'nav.resume' as const },
  { key: 'search', href: ROUTES.PROTECTED.SEARCH, icon: Search, labelKey: 'nav.search' as const },
  { key: 'chat', href: ROUTES.PROTECTED.CHAT, icon: MessageCircle, labelKey: 'nav.chat' as const },
  { key: 'profile', href: ROUTES.PROTECTED.PROFILE, icon: User, labelKey: 'nav.profile' as const },
];

export function BottomNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { data } = useAuthSession({ query: { select: selectEnvelopeData } });

  const isAuthenticated = !!data?.user;
  const hasCompletedOnboarding = data?.user?.hasCompletedOnboarding ?? false;

  // Don't show bottom nav if not authenticated or still onboarding
  if (!isAuthenticated || !hasCompletedOnboarding) {
    return null;
  }

  // Normalize pathname for comparison
  const normalizedPathname = pathname ? removeLocalePrefix(pathname) : '';

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-50 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-lg md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            normalizedPathname === item.href ||
            (item.href !== ROUTES.PROTECTED.ROOT && normalizedPathname.startsWith(item.href));

          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'flex min-w-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-all',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-500 active:bg-white/5 active:text-zinc-300',
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive && 'text-blue-400')}
                strokeWidth={isActive ? 2 : 1.5}
              />
              <span className="text-[10px] font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area padding for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-[#0A0A0A]/95" />
    </nav>
  );
}
