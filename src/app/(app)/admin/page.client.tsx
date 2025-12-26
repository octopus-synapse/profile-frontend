"use client";

/**
 * Admin Dashboard Page
 */

import { Users, FileText, UserCheck, Globe } from "lucide-react";
import {
  StatCard,
  SystemHealthWidget,
  RecentUsersWidget,
  RecentActivityWidget,
  useAdminStats,
  useSystemHealth,
  useRecentUsers,
  useRecentActivity,
} from "@/features/admin";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: health, isLoading: healthLoading } = useSystemHealth();
  const { data: recentUsers, isLoading: usersLoading } = useRecentUsers(5);
  const { data: activities, isLoading: activitiesLoading } = useRecentActivity(10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-gh-fg-default text-2xl font-bold">Dashboard</h1>
        <p className="text-gh-fg-muted mt-1">Overview of system statistics and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          trend={`+${stats?.newUsersThisWeek ?? 0} this week`}
          trendUp={(stats?.newUsersThisWeek ?? 0) > 0}
          loading={statsLoading}
        />
        <StatCard
          label="Active Users"
          value={stats?.activeUsers ?? 0}
          icon={UserCheck}
          loading={statsLoading}
        />
        <StatCard
          label="Total Resumes"
          value={stats?.totalResumes ?? 0}
          icon={FileText}
          loading={statsLoading}
        />
        <StatCard
          label="Public Profiles"
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
