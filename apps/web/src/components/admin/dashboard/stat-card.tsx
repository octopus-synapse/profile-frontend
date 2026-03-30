'use client';

/**
 * Admin Stat Card Component
 * Clean, professional design
 */

import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  icon?: LucideIcon;
  loading?: boolean;
}

export function StatCard({ label, value, trend, trendUp, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="border-pf-border-default bg-pf-canvas-overlay rounded-xl border p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="bg-pf-canvas-subtle skeleton h-4 w-20 rounded" />
            <div className="bg-pf-canvas-subtle skeleton h-8 w-16 rounded" />
          </div>
          <div className="bg-pf-canvas-subtle skeleton h-12 w-12 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis group rounded-xl border p-6 transition-all hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-pf-fg-muted text-sm font-medium">{label}</p>
          <p className="text-pf-fg-default mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              {trendUp ? (
                <TrendingUp className="text-pf-success-fg h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <TrendingDown className="text-pf-danger-fg h-3.5 w-3.5" strokeWidth={2} />
              )}
              <p
                className={cn(
                  'text-xs font-medium',
                  trendUp ? 'text-pf-success-fg' : 'text-pf-danger-fg',
                )}
              >
                {trend}
              </p>
            </div>
          )}
        </div>
        {Icon && (
          <div className="bg-pf-canvas-subtle group-hover:bg-pf-canvas-emphasis group-hover:text-pf-fg-on-emphasis text-pf-fg-muted flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}
