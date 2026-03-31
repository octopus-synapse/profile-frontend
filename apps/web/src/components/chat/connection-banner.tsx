'use client';

import { useT } from '@profile/i18n';
import { WifiOff } from 'lucide-react';
import { useSocket } from '@/shared/providers/socket-provider';

/**
 * Shows a banner when WebSocket connection is lost or reconnecting.
 * Renders nothing when connected.
 */
export function ConnectionBanner() {
  const { status } = useSocket();
  const t = useT();

  if (status === 'connected' || status === 'disconnected') return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-amber-600/90 px-3 py-1.5 text-xs font-medium text-white">
      <WifiOff className="h-3.5 w-3.5" />
      <span>{t('social.chat.reconnecting')}</span>
    </div>
  );
}
