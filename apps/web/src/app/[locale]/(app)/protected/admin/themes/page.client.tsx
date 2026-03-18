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
        <h1 className="text-white text-2xl font-semibold tracking-tight">Theme Approvals</h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Review and approve user-submitted themes for public use
        </p>
      </div>

      {/* Quick Status Banner */}
      {pendingCount > 0 ? (
        <div className="bg-amber-500/10 border-amber-500/30 flex items-center gap-3 rounded-xl border px-5 py-4">
          <div className="bg-amber-500/20 flex h-10 w-10 items-center justify-center rounded-full">
            <Clock className="text-amber-400 h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {pendingCount} theme{pendingCount !== 1 ? 's' : ''} awaiting review
            </p>
            <p className="text-zinc-400 text-xs">
              Review submissions to make them available for all users
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-500/10 border-emerald-500/30 flex items-center gap-3 rounded-xl border px-5 py-4">
          <div className="bg-emerald-500/20 flex h-10 w-10 items-center justify-center rounded-full">
            <Check className="text-emerald-400 h-5 w-5" strokeWidth={2} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">All caught up!</p>
            <p className="text-zinc-400 text-xs">No themes pending review at the moment</p>
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
      <div className="border-white/10 bg-[#0A0A0A]/80 rounded-xl border">
        <div className="border-white/10 flex items-center gap-2 border-b px-6 py-4">
          <Palette className="text-zinc-400 h-5 w-5" strokeWidth={1.5} />
          <span className="text-white text-sm font-semibold">Pending Reviews</span>
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
      text: 'text-amber-400',
      bg: 'bg-amber-500/20',
    },
    success: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/20',
    },
    danger: {
      text: 'text-red-400',
      bg: 'bg-red-500/20',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="border-white/10 bg-[#0A0A0A]/80 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-zinc-400 text-sm font-medium">{label}</p>
          <p className={`mt-1 text-2xl font-semibold ${styles.text}`}>{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${styles.bg}`}>
          <Icon className={`h-6 w-6 ${styles.text}`} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
