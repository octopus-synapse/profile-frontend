/**
 * Protected Dashboard Page
 * Main page for authenticated users
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your personal dashboard",
};

export default function ProtectedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Dashboard</h1>
        <p className="mt-1 text-zinc-400">Welcome to your personal dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder cards */}
        <DashboardCard
          title="Profile"
          description="View and edit your profile"
          href="/protected/profile"
        />
        <DashboardCard title="Resume" description="Manage your resume" href="/protected/resume" />
        <DashboardCard
          title="Settings"
          description="Configure your account"
          href="/protected/settings"
        />
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
}

function DashboardCard({ title, description, href }: DashboardCardProps) {
  return (
    <a
      href={href}
      className="block rounded-lg border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
    >
      <h3 className="font-semibold text-zinc-100">{title}</h3>
      <p className="mt-1 text-sm text-zinc-400">{description}</p>
    </a>
  );
}
