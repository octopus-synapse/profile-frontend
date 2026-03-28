/**
 * ReviewSectionCard — individual section card for the review grid.
 *
 * Renders icon from backend metadata + completion status.
 */

'use client';

import { useI18n } from '@profile/i18n';
import {
  AlertCircle,
  AtSign,
  Briefcase,
  CheckCircle2,
  Code,
  Edit2,
  Globe,
  GraduationCap,
  type LucideIcon,
  Palette,
  User,
} from 'lucide-react';

export interface ReviewSectionItem {
  id: string;
  label: string;
  icon?: string;
  isComplete: boolean;
  summary: string | null;
  optional: boolean;
}

const LUCIDE_ICONS: Record<string, LucideIcon> = {
  user: User,
  'at-sign': AtSign,
  briefcase: Briefcase,
  palette: Palette,
  'graduation-cap': GraduationCap,
  code: Code,
  globe: Globe,
};

function getIconComponent(iconName?: string): LucideIcon | null {
  if (!iconName) return null;
  return LUCIDE_ICONS[iconName.toLowerCase()] ?? null;
}

function renderIcon(iconStr?: string, fallback: LucideIcon = Code) {
  if (!iconStr) {
    const Fallback = fallback;
    return <Fallback className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />;
  }

  const LucideComponent = getIconComponent(iconStr);
  if (LucideComponent) {
    return <LucideComponent className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />;
  }

  return <span className="text-sm">{iconStr}</span>;
}

interface ReviewSectionCardProps {
  section: ReviewSectionItem;
  onEdit: (stepId: string) => void;
}

export function ReviewSectionCard({ section, onEdit }: ReviewSectionCardProps) {
  const { t } = useI18n();
  return (
    <div
      className={`rounded-2xl border p-4 transition-colors ${
        section.isComplete ? 'border-white/10 bg-zinc-950/40' : 'border-red-500/40 bg-red-500/5'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {section.isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
          )}
          {renderIcon(section.icon)}
          <span className="text-sm font-medium text-white">{section.label}</span>
          {section.optional && (
            <span className="text-[11px] text-zinc-500">
              {t('onboarding.review.optional' as Parameters<typeof t>[0])}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onEdit(section.id)}
          aria-label={`Edit ${section.label}`}
          className="rounded-lg p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-blue-400"
        >
          <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
      </div>
      {section.summary && (
        <p className="mt-2 truncate pl-6 text-sm text-zinc-400">{section.summary}</p>
      )}
    </div>
  );
}
