"use client";

/**
 * Recent Users Widget
 * Developer-inspired design with code aesthetic
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Avatar, Skeleton } from "@/shared/components/ui";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Users, ChevronRight, Code2 } from "lucide-react";
import { formatDistanceToNow } from "@/shared/utils";
import type { AdminUser } from "../types";

interface RecentUsersWidgetProps {
  users?: AdminUser[];
  loading?: boolean;
}

export function RecentUsersWidget({ users, loading }: RecentUsersWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// recent_users</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="font-mono text-sm">recent_users</CardTitle>
        </div>
        <Link
          href="/admin/users"
          className="text-pf-fg-muted hover:text-pf-fg-default flex items-center gap-1 font-mono text-xs transition-colors"
        >
          view_all
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </CardHeader>
      <CardContent>
        {!users || users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No users yet"
            description="Users will appear here once they sign up"
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <Avatar
                  src={user.image}
                  alt={user.name ?? "User"}
                  fallback={getInitials(user.name ?? user.email)}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-pf-fg-default truncate font-mono text-sm">
                      {user.name ?? "no_name"}
                    </p>
                    {user.role === "ADMIN" && <span className="dev-badge text-[10px]">admin</span>}
                  </div>
                  <p className="text-pf-fg-muted truncate font-mono text-xs">{user.email}</p>
                </div>
                <p className="text-pf-fg-subtle font-mono text-xs">
                  {formatDistanceToNow(new Date(user.createdAt))}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
