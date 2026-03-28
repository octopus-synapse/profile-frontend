/**
 * SecurityFooter — status indicators for auth forms.
 */

'use client';

import { useT } from '@profile/i18n';

export function SecurityFooter() {
  const t = useT();

  return (
    <div className="mt-4 flex items-center justify-center gap-4 font-mono text-[10px] tracking-tighter text-zinc-600 uppercase">
      <div className="flex items-center gap-1">
        <div className="h-1 w-1 rounded-full bg-cyan-500" />
        <span>{t('auth.security.secure')}</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="h-1 w-1 rounded-full bg-cyan-500" />
        <span>{t('auth.security.encrypted')}</span>
      </div>
    </div>
  );
}
