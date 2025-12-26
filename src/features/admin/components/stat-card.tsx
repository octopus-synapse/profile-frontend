"use client";

/**
 * Admin Stat Card Component
 */

import { LucideIcon } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gh-fg-muted text-sm font-medium">{label}</p>
          <p className="text-gh-fg-default mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-sm font-medium",
                trendUp ? "text-gh-success-fg" : "text-gh-danger-fg"
              )}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="bg-gh-accent-subtle rounded-lg p-3">
            <Icon className="text-gh-accent-fg h-6 w-6" />
          </div>
        )}
      </div>
    </Card>
  );
}
