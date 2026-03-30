/**
 * Theme Card
 * Elegant compact theme preview
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import {
  Check,
  Clock,
  Copy,
  Globe,
  Lock,
  Pencil,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import type { ResumeStyleConfig, Theme } from '../types/config';

interface Props {
  theme: Theme;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFork?: () => void;
  onSubmitForApproval?: () => void;
  showActions?: boolean;
}

export function ThemeCard({
  theme,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onFork,
  onSubmitForApproval,
  showActions = true,
}: Props) {
  const isPublic = theme.status === 'PUBLISHED';
  const isSystem = theme.isSystemTheme;
  const isPrivate = theme.status === 'PRIVATE';
  const isPending = theme.status === 'PENDING_APPROVAL';
  const isRejected = theme.status === 'REJECTED';

  const canDelete = !isPublic && !isSystem;
  const canDirectEdit = !isPublic && !isSystem;
  const canSubmit = isPrivate && !isSystem;

  // Extract colors from styleConfig
  const styleConfig = theme.styleConfig as Partial<ResumeStyleConfig> | undefined;
  const colors = styleConfig?.colors ?? styleConfig?.tokens?.colors;
  const primaryRaw = colors?.primary;
  const primaryColor = typeof primaryRaw === 'string' ? primaryRaw : '#3B82F6';
  const bgRaw = colors?.background;
  const bgColor = typeof bgRaw === 'string' ? bgRaw : '#FFFFFF';
  const textRaw = colors?.text;
  const textColor = typeof textRaw === 'string' ? textRaw : (textRaw?.primary ?? '#1E293B');

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all',
        isActive
          ? 'border-blue-500/50 ring-2 ring-blue-500/20'
          : 'border-white/10 hover:border-white/20',
      )}
    >
      {/* Clickable area */}
      <button
        type="button"
        className="flex w-full items-start gap-3 p-3 text-left"
        onClick={onSelect}
      >
        {/* Color preview */}
        <div
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-sm ring-1 ring-white/10"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute inset-1 flex flex-col gap-0.5">
            <div className="h-1 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
            <div
              className="h-0.5 w-3/4 rounded-sm opacity-50"
              style={{ backgroundColor: textColor }}
            />
            <div
              className="h-0.5 w-1/2 rounded-sm opacity-30"
              style={{ backgroundColor: textColor }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-white">{theme.name}</h3>
            <StatusIcon theme={theme} />
          </div>
          <p className="mt-0.5 truncate text-xs text-zinc-400">
            {theme.description || getCategoryLabel(theme.category)}
          </p>

          {/* Swatches */}
          <div className="mt-1.5 flex gap-1">
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: bgColor }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-white/10"
              style={{ backgroundColor: textColor }}
            />
          </div>
        </div>

        {/* Active check */}
        {isActive && (
          <div className="absolute top-2 right-2 rounded-full bg-blue-500 p-1">
            <Check className="h-3 w-3 text-white" strokeWidth={2} />
          </div>
        )}
      </button>

      {/* Actions */}
      {showActions && (
        <div className="flex border-t border-white/10">
          {canDirectEdit ? (
            <ActionButton onClick={onEdit} icon={Pencil} label="Edit" />
          ) : (
            <ActionButton onClick={onFork} icon={Copy} label="Customize" />
          )}

          {canSubmit && (
            <ActionButton onClick={onSubmitForApproval} icon={Send} label="Submit" tone="warning" />
          )}

          {canDelete && !isPending && (
            <ActionButton onClick={onDelete} icon={Trash2} label="Delete" tone="danger" />
          )}
        </div>
      )}

      {/* Rejection note */}
      {isRejected && theme.rejectionReason && (
        <div className="border-t border-red-500/20 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-400">
            <span className="font-medium">Rejected:</span> {theme.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ theme }: { theme: Theme }) {
  const { t } = useI18n();

  if (theme.isSystemTheme) {
    return (
      <span
        className="rounded-full bg-white/10 p-0.5 text-zinc-400"
        title={t('resume.theme.card.system')}
      >
        <Sparkles className="h-3 w-3" strokeWidth={1.5} />
      </span>
    );
  }
  switch (theme.status) {
    case 'PUBLISHED':
      return (
        <span
          className="rounded-full bg-emerald-500/20 p-0.5 text-emerald-400"
          title={t('resume.theme.card.public')}
        >
          <Globe className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    case 'PENDING_APPROVAL':
      return (
        <span
          className="rounded-full bg-amber-500/20 p-0.5 text-amber-400"
          title={t('resume.theme.card.pending')}
        >
          <Clock className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className="rounded-full bg-red-500/20 p-0.5 text-red-400"
          title={t('resume.theme.card.rejected')}
        >
          <XCircle className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    default:
      return (
        <span
          className="rounded-full bg-white/10 p-0.5 text-zinc-400"
          title={t('resume.theme.card.private')}
        >
          <Lock className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
  }
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  tone = 'neutral',
}: {
  onClick?: () => void;
  icon: typeof Pencil;
  label: string;
  tone?: 'neutral' | 'warning' | 'danger';
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      tone={tone}
      size="xs"
      leftIcon={<Icon className="h-3 w-3" strokeWidth={1.5} />}
      onPress={onClick}
    >
      {label}
    </Button>
  );
}

function getCategoryLabel(category?: string): string {
  if (!category) return 'Custom theme';
  const labels: Record<string, string> = {
    PROFESSIONAL: 'Professional style',
    CREATIVE: 'Creative design',
    TECHNICAL: 'Technical focus',
    ACADEMIC: 'Academic format',
    MINIMAL: 'Minimal & clean',
    MODERN: 'Modern layout',
    CLASSIC: 'Classic design',
    EXECUTIVE: 'Executive style',
  };
  return labels[category] || 'Custom theme';
}
