'use client';

/**
 * Admin Dashboard Page
 * Clean, professional design
 */

import { useT } from '@profile/i18n';
import { CheckCircle2, FileText, Globe, UserCheck, Users } from 'lucide-react';
import {
  RecentActivityWidget,
  RecentUsersWidget,
  StatCard,
  SystemHealthWidget,
  useAdminStats,
  useRecentActivity,
  useRecentUsers,
  useSystemHealth,
} from '@/components/admin';

export default function AdminDashboardPage() {
  const t = useT();
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: recentUsers, isLoading: usersLoading } = useRecentUsers(5);
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity(10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-pf-fg-default text-2xl font-semibold tracking-tight">{t('admin.dashboard.title')}</h1>
        <p className="text-pf-fg-muted mt-1 text-sm">
          {t('admin.dashboard.subtitle')}
        </p>
      </div>

      {/* Quick Status Banner */}
      <div className="bg-pf-success-subtle/50 border-pf-success-muted flex items-center gap-3 rounded-xl border px-5 py-4">
        <div className="bg-pf-success-subtle flex h-10 w-10 items-center justify-center rounded-full">
          <CheckCircle2 className="text-pf-success-fg h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <p className="text-pf-fg-default text-sm font-medium">{t('admin.dashboard.allOperational')}</p>
          <p className="text-pf-fg-muted text-xs">
            {t('admin.dashboard.servicesRunning')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t('admin.dashboard.totalUsers')}
          value={stats?.totalUsers ?? 0}
          icon={Users}
          trend={`+${stats?.newUsersThisWeek ?? 0} this week`}
          trendUp={(stats?.newUsersThisWeek ?? 0) > 0}
          loading={statsLoading}
        />
        <StatCard
          label={t('admin.dashboard.activeUsers')}
          value={stats?.activeUsers ?? 0}
          icon={UserCheck}
          loading={statsLoading}
        />
        <StatCard
          label={t('admin.dashboard.resumesCreated')}
          value={stats?.totalResumes ?? 0}
          icon={FileText}
          loading={statsLoading}
        />
        <StatCard
          label={t('admin.dashboard.publicProfiles')}
          value={stats?.publicProfiles ?? 0}
          icon={Globe}
          loading={statsLoading}
        />
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentUsersWidget users={recentUsers} loading={usersLoading} />
        <SystemHealthWidget health={health} loading={healthLoading} />
      </div>

      {/* Activity Feed */}
      <RecentActivityWidget activities={activities} loading={activitiesLoading} />
    </div>
  );
}
