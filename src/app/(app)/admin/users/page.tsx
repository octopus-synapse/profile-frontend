/**
 * Admin Users Page
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage system users",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">User Management</h1>
          <p className="mt-1 text-zinc-400">View and manage all registered users</p>
        </div>
        <button className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
          Export Users
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
        />
        <select className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none">
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">User</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                User management will be implemented in the API layer milestone
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
