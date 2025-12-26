/**
 * Admin Dashboard Page
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Admin Dashboard</h1>
        <p className="mt-1 text-zinc-400">Overview of system statistics and recent activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value="0" trend="+0%" />
        <StatCard label="Active Users" value="0" trend="+0%" />
        <StatCard label="Total Resumes" value="0" trend="+0%" />
        <StatCard label="Public Profiles" value="0" trend="+0%" />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-semibold text-zinc-100">Recent Users</h3>
          <p className="mt-2 text-sm text-zinc-500">No recent users</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-semibold text-zinc-100">System Status</h3>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-zinc-400">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  trend: string;
}

function StatCard({ label, value, trend }: StatCardProps) {
  const isPositive = trend.startsWith("+");

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-zinc-100">{value}</p>
      <p className={`mt-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {trend} from last month
      </p>
    </div>
  );
}
