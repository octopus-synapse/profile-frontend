"use client";

/**
 * Admin Users Page Client Component
 * Clean, professional design
 */

import { UsersTable } from "@/features/admin";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">User Management</h1>
        <p className="mt-1 text-sm text-zinc-400">
          View and manage all registered users on your platform
        </p>
      </div>

      {/* Users Table */}
      <UsersTable />
    </div>
  );
}
