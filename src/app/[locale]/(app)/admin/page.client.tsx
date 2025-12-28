"use client";

/**
 * Admin Dashboard Page
 * Developer-inspired design with code aesthetic
 */

import { Users, FileText, UserCheck, Globe, Code2 } from "lucide-react";
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
        <div className="mb-4 inline-flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">// Admin Dashboard</span>
        </div>
        <h1 className="text-pf-fg-default text-2xl font-bold">
          admin<span className="text-pf-fg-muted font-normal">.dashboard()</span>
        </h1>
        <p className="text-pf-fg-muted mt-1 font-mono text-sm">
          Overview of system statistics and recent activity
        </p>
      </div>

      {/* Quick Status Terminal */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/admin/status</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">admin status --all</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-success-fg">✔ System operational</div>
            <div className="text-pf-fg-muted mt-1">
              All services running normally. Last check: just now
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="total_users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          trend={`+${stats?.newUsersThisWeek ?? 0} this week`}
          trendUp={(stats?.newUsersThisWeek ?? 0) > 0}
          loading={statsLoading}
        />
        <StatCard
          label="active_users"
          value={stats?.activeUsers ?? 0}
          icon={UserCheck}
          loading={statsLoading}
        />
        <StatCard
          label="total_resumes"
          value={stats?.totalResumes ?? 0}
          icon={FileText}
          loading={statsLoading}
        />
        <StatCard
          label="public_profiles"
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
