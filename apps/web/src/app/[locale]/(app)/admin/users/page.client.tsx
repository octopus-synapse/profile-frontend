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
        <h1 className="text-pf-fg-default text-2xl font-semibold tracking-tight">
          User Management
        </h1>
        <p className="text-pf-fg-muted mt-1 text-sm">
          View and manage all registered users on your platform
        </p>
      </div>

      {/* Users Table */}
      <UsersTable />
    </div>
  );
}
