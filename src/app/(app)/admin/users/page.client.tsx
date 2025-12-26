"use client";

/**
 * Admin Users Page Client Component
 */

import { UsersTable } from "@/features/admin";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gh-fg-default text-2xl font-bold">User Management</h1>
        <p className="text-gh-fg-muted mt-1">View and manage all registered users</p>
      </div>
      <UsersTable />
    </div>
  );
}
