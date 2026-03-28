'use client';

/**
 * Platform Statistics Widget
 *
 * Card grid showing key platform metrics.
 */

import { useT } from '@profile/i18n';
import { Activity, FileText, Users, Zap } from 'lucide-react';
import { usePlatformStats } from './hooks/use-platform-stats';
import { StatCard } from './stat-card';

export function PlatformStatsWidget() {
  const t = useT();
  const { data, isLoading } = usePlatformStats();

  const cards = [
    {
      label: t('admin.dashboard.totalUsers'),
      value: data?.totalUsers ?? 0,
      icon: Users,
    },
    {
      label: t('admin.dashboard.totalResumes'),
      value: data?.totalResumes ?? 0,
      icon: FileText,
    },
    {
      label: t('admin.dashboard.activeToday'),
      value: data?.activeUsersToday ?? 0,
      icon: Zap,
    },
    {
      label: t('admin.dashboard.activeThisWeek'),
      value: data?.activeUsersWeek ?? 0,
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          loading={isLoading}
        />
      ))}
    </div>
  );
}
