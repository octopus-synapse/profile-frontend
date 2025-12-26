"use client";

/**
 * Recent Users Widget
 */

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Users, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "@/shared/utils/date";
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
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
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
        <CardTitle>Recent Users</CardTitle>
        <Link
          href="/admin/users"
          className="text-gh-fg-muted hover:text-gh-fg-default flex items-center gap-1 text-sm transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
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
                    <p className="text-gh-fg-default truncate text-sm font-medium">
                      {user.name ?? "No name"}
                    </p>
                    {user.role === "ADMIN" && (
                      <Badge variant="warning" size="sm">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-gh-fg-muted truncate text-xs">{user.email}</p>
                </div>
                <p className="text-gh-fg-subtle text-xs">
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
