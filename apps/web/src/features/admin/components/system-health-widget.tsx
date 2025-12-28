"use client";

/**
 * System Health Widget
 * Developer-inspired design with code aesthetic
 */

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import {
  Database,
  Server,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Code2,
} from "lucide-react";
import type { SystemHealth } from "../types";

interface SystemHealthWidgetProps {
  health?: SystemHealth;
  loading?: boolean;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: "text-pf-success-fg",
    bgColor: "bg-pf-canvas-emphasis",
    textColor: "text-pf-fg-on-emphasis",
    label: "online",
  },
  degraded: {
    icon: AlertTriangle,
    color: "text-pf-attention-fg",
    bgColor: "bg-pf-attention-subtle",
    textColor: "text-pf-attention-fg",
    label: "degraded",
  },
  down: {
    icon: XCircle,
    color: "text-pf-danger-fg",
    bgColor: "bg-pf-danger-subtle",
    textColor: "text-pf-danger-fg",
    label: "offline",
  },
};

const services = [
  { key: "database" as const, label: "database", icon: Database },
  { key: "api" as const, label: "api_server", icon: Server },
  { key: "storage" as const, label: "storage", icon: HardDrive },
];

export function SystemHealthWidget({ health, loading }: SystemHealthWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// system_health</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="font-mono text-sm">system_health</CardTitle>
        </div>
        {health?.lastChecked && (
          <span className="text-pf-fg-muted font-mono text-xs">
            updated: {new Date(health.lastChecked).toLocaleTimeString()}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => {
          const status = health?.[service.key] ?? "healthy";
          const config = statusConfig[status];
          const StatusIcon = config.icon;

          return (
            <div key={service.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis p-2">
                  <service.icon className="h-4 w-4" strokeWidth={1.5} />
                </div>
                <span className="text-pf-fg-default font-mono text-sm">{service.label}</span>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 font-mono text-xs",
                  config.bgColor,
                  config.textColor
                )}
              >
                <StatusIcon className="h-3 w-3" strokeWidth={1.5} />
                {config.label}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
