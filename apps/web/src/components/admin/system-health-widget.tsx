'use client';

/**
 * System Health Widget
 * Clean, professional design
 */

import { useT } from '@profile/i18n';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  HardDrive,
  Server,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/components/ui';
import { cn } from '@/shared/utils/cn';
import type { SystemHealth } from './types';

interface SystemHealthWidgetProps {
  health?: SystemHealth;
  loading?: boolean;
}

const statusConfig = {
  healthy: {
    icon: CheckCircle2,
    color: 'text-pf-success-fg',
    bgColor: 'bg-pf-success-subtle',
    labelKey: 'admin.systemHealth.healthy' as const,
  },
  degraded: {
    icon: AlertTriangle,
    color: 'text-pf-attention-fg',
    bgColor: 'bg-pf-attention-subtle',
    labelKey: 'admin.systemHealth.degraded' as const,
  },
  down: {
    icon: XCircle,
    color: 'text-pf-danger-fg',
    bgColor: 'bg-pf-danger-subtle',
    labelKey: 'admin.systemHealth.down' as const,
  },
};

const SERVICE_ITEMS = [
  { key: 'database' as const, labelKey: 'admin.systemHealth.database' as const, icon: Database },
  { key: 'api' as const, labelKey: 'admin.systemHealth.apiServer' as const, icon: Server },
  { key: 'storage' as const, labelKey: 'admin.systemHealth.storage' as const, icon: HardDrive },
];

export function SystemHealthWidget({ health, loading }: SystemHealthWidgetProps) {
  const t = useT();
  if (loading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-default text-sm font-semibold">
              {t('admin.systemHealth.title')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24 rounded" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="text-sm font-semibold">{t('admin.systemHealth.title')}</CardTitle>
        </div>
        {health?.lastChecked && (
          <span className="text-pf-fg-muted text-xs">
            Updated {new Date(health.lastChecked).toLocaleTimeString()}
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {SERVICE_ITEMS.map((service) => {
          const status = health?.[service.key] ?? 'healthy';
          const config = statusConfig[status];
          const StatusIcon = config.icon;

          return (
            <div key={service.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-pf-canvas-subtle flex h-10 w-10 items-center justify-center rounded-lg">
                  <service.icon className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-pf-fg-default text-sm font-medium">
                  {t(service.labelKey)}
                </span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                  config.bgColor,
                  config.color,
                )}
              >
                <StatusIcon className="h-3.5 w-3.5" strokeWidth={2} />
                {t(config.labelKey)}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
