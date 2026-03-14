'use client';

/**
 * Recent Users Widget
 * Clean, professional design
 */

import { ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';
import { Avatar, Card, CardContent, CardHeader, CardTitle, Skeleton } from '@/shared/components/ui';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDistanceToNow } from '@/shared/utils';
import type { AdminUser } from './types';

interface RecentUsersWidgetProps {
  users?: AdminUser[];
  loading?: boolean;
}

export function RecentUsersWidget({ users, loading }: RecentUsersWidgetProps) {
  if (loading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-default text-sm font-semibold">Recent Users</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="text-sm font-semibold">Recent Users</CardTitle>
        </div>
        <Link
          href="/admin/users"
          className="text-pf-fg-muted hover:text-pf-fg-default flex items-center gap-1 text-xs font-medium transition-colors"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
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
                  alt={user.name ?? 'User'}
                  fallback={getInitials(user.name ?? user.email)}
                  size="md"
                  className="rounded-full"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-pf-fg-default truncate text-sm font-medium">
                      {user.name ?? 'Unnamed User'}
                    </p>
                    {user.role === 'ADMIN' && (
                      <span className="bg-pf-accent-subtle text-pf-accent-fg rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-pf-fg-muted truncate text-xs">{user.email}</p>
                </div>
                <p className="text-pf-fg-subtle text-xs">
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
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
