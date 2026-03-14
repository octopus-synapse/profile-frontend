'use client';

/**
 * Admin Theme Approvals Page
 * Clean, professional design
 */

import { Check, Clock, Palette, X } from 'lucide-react';
import { ThemeApprovalQueue, usePendingThemes } from '@/components/resume';

export default function ThemeApprovalsClient() {
  const { data: pendingThemes } = usePendingThemes();
  const pendingCount = pendingThemes?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-pf-fg-default text-2xl font-semibold tracking-tight">
          Theme Approvals
        </h1>
        <p className="text-pf-fg-muted mt-1 text-sm">
          Review and approve user-submitted themes for public use
        </p>
      </div>

      {/* Quick Status Banner */}
      {pendingCount > 0 ? (
        <div className="bg-pf-attention-subtle/50 border-pf-attention-muted flex items-center gap-3 rounded-xl border px-5 py-4">
          <div className="bg-pf-attention-subtle flex h-10 w-10 items-center justify-center rounded-full">
            <Clock className="text-pf-attention-fg h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-pf-fg-default text-sm font-medium">
              {pendingCount} theme{pendingCount !== 1 ? 's' : ''} awaiting review
            </p>
            <p className="text-pf-fg-muted text-xs">
              Review submissions to make them available for all users
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-pf-success-subtle/50 border-pf-success-muted flex items-center gap-3 rounded-xl border px-5 py-4">
          <div className="bg-pf-success-subtle flex h-10 w-10 items-center justify-center rounded-full">
            <Check className="text-pf-success-fg h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-pf-fg-default text-sm font-medium">All caught up!</p>
            <p className="text-pf-fg-muted text-xs">No themes pending review at the moment</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="Pending Review" value={pendingCount} icon={Clock} variant="attention" />
        <StatsCard label="Approved Today" value={0} icon={Check} variant="success" />
        <StatsCard label="Rejected Today" value={0} icon={X} variant="danger" />
      </div>

      {/* Approval Queue */}
      <div className="border-pf-border-default bg-pf-canvas-overlay rounded-xl border">
        <div className="border-pf-border-default flex items-center gap-2 border-b px-6 py-4">
          <Palette className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-default text-sm font-semibold">Pending Reviews</span>
        </div>
        <div className="p-6">
          <ThemeApprovalQueue />
        </div>
      </div>
    </div>
  );
}

import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant: 'attention' | 'success' | 'danger';
}

function StatsCard({ label, value, icon: Icon, variant }: StatsCardProps) {
  const variantStyles = {
    attention: {
      text: 'text-pf-attention-fg',
      bg: 'bg-pf-attention-subtle',
    },
    success: {
      text: 'text-pf-success-fg',
      bg: 'bg-pf-success-subtle',
    },
    danger: {
      text: 'text-pf-danger-fg',
      bg: 'bg-pf-danger-subtle',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="border-pf-border-default bg-pf-canvas-overlay rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pf-fg-muted text-sm font-medium">{label}</p>
          <p className={`mt-1 text-2xl font-semibold ${styles.text}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.text}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
