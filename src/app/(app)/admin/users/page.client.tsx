"use client";

/**
 * Admin Users Page Client Component
 * Developer-inspired design with code aesthetic
 */

import { Code2 } from "lucide-react";
import { UsersTable } from "@/features/admin";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-4 inline-flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">// Users Management</span>
        </div>
        <h1 className="text-pf-fg-default text-2xl font-bold">
          admin<span className="text-pf-fg-muted font-normal">.users()</span>
        </h1>
        <p className="text-pf-fg-muted mt-1 font-mono text-sm">
          View and manage all registered users
        </p>
      </div>

      {/* Terminal Info */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/admin/users</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">admin users --list</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-fg-muted">Fetching user records...</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <UsersTable />
    </div>
  );
}
