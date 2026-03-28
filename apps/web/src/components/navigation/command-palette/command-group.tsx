'use client';

import type { ReactNode } from 'react';

interface CommandGroupProps {
  label: string;
  children: ReactNode;
}

export function CommandGroup({ label, children }: CommandGroupProps) {
  return (
    <div className="px-2 py-2">
      <p className="mb-1 px-3 text-[11px] font-medium tracking-wider text-pf-fg-subtle uppercase">
        {label}
      </p>
      <div role="listbox">{children}</div>
    </div>
  );
}
