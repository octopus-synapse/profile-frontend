"use client";

/**
 * System Health Widget
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/utils/cn";
import { Database, Server, HardDrive, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import type { SystemHealth } from "../types";

interface SystemHealthWidgetProps {
  health?: SystemHealth;
  loading?: boolean;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "text-gh-success-fg",
    bgColor: "bg-gh-success-subtle",
    label: "Healthy",
  },
  degraded: {
    icon: AlertTriangle,
    color: "text-gh-attention-fg",
    bgColor: "bg-gh-attention-subtle",
    label: "Degraded",
  },
  down: {
    icon: XCircle,
    color: "text-gh-danger-fg",
    bgColor: "bg-gh-danger-subtle",
    label: "Down",
  },
};

const services = [
  { key: "database" as const, label: "Database", icon: Database },
  { key: "api" as const, label: "API Server", icon: Server },
  { key: "storage" as const, label: "Storage", icon: HardDrive },
];

export function SystemHealthWidget({ health, loading }: SystemHealthWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>System Health</span>
          {health?.lastChecked && (
            <span className="text-gh-fg-muted text-xs font-normal">
              Updated {new Date(health.lastChecked).toLocaleTimeString()}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => {
          const status = health?.[service.key] ?? "healthy";
          const config = statusConfig[status];
          const StatusIcon = config.icon;

          return (
            <div key={service.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", config.bgColor)}>
                  <service.icon className={cn("h-4 w-4", config.color)} />
                </div>
                <span className="text-gh-fg-default text-sm font-medium">{service.label}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                  config.bgColor,
                  config.color
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {config.label}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
