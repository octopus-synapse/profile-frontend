'use client';

import type { DictionaryKey } from '@profile/i18n';
import { Briefcase } from 'lucide-react';
import { FOCO_SKILL_KEYS } from '../../data';

interface ProfileCardProps {
  t: (key: DictionaryKey, params?: Record<string, string | number>) => string;
}

export function ProfileCard({ t }: ProfileCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-cyan-600" strokeWidth={1.5} />
        <h3 className="font-display text-sm font-bold uppercase tracking-wider text-zinc-900">
          {t('landing.foco.experienceBank')}
        </h3>
      </div>

      <ul className="space-y-3">
        {FOCO_SKILL_KEYS.map((key) => (
          <li
            key={key}
            className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-700"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            {t(key)}
          </li>
        ))}
      </ul>
    </div>
  );
}
