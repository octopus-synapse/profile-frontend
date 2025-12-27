"use client";

/**
 * Admin Stat Card Component
 * Developer-inspired design with code aesthetic
 */

import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/cn";

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
      <div className="border-pf-border-default bg-pf-canvas-overlay border p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="bg-pf-canvas-subtle skeleton h-4 w-20" />
            <div className="bg-pf-canvas-subtle skeleton h-8 w-16" />
          </div>
          <div className="bg-pf-canvas-subtle skeleton h-10 w-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis border p-6 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pf-fg-muted font-mono text-xs">{label}</p>
          <p className="text-pf-fg-default mt-2 font-mono text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 font-mono text-xs",
                trendUp ? "text-pf-success-fg" : "text-pf-danger-fg"
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis p-3">
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
}
