'use client';

/**
 * Users Table Parts
 *
 * Sub-components for the users table: row with actions,
 * loading skeleton rows, and delete confirmation dialog.
 */

import { useT } from '@profile/i18n';
import { MoreVertical, Shield, Trash2, User, Users } from 'lucide-react';
import { Avatar, Badge, Button, Skeleton } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { EmptyState } from '@/shared/components/ui/empty-state';
import { formatDate, formatDistanceToNow } from '@/shared/utils/date';
import type { UserRole } from '../users/types';
import type { AdminUserData } from './hooks';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface UsersTableRowProps {
  user: AdminUserData;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onDeleteRequest: (userId: string) => void;
}

export function UsersTableRow({ user, onRoleChange, onDeleteRequest }: UsersTableRowProps) {
  const t = useT();
  return (
    <tr className="hover:bg-pf-canvas-subtle/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={user.image}
            alt={user.name ?? 'User'}
            fallback={getInitials(user.name ?? user.email)}
            size="md"
          />
          <div>
            <p className="text-pf-fg-default text-sm font-medium">{user.name ?? t('admin.users.table.noName')}</p>
            <p className="text-pf-fg-muted text-xs">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={user.role === 'ADMIN' ? 'warning' : 'secondary'}>{user.role}</Badge>
      </td>
      <td className="text-pf-fg-muted px-4 py-3 text-sm">{user.resumeCount}</td>
      <td className="text-pf-fg-muted px-4 py-3 text-sm">
        {formatDate(new Date(user.createdAt))}
      </td>
      <td className="text-pf-fg-muted px-4 py-3 text-sm">
        {user.lastLoginAt ? formatDistanceToNow(new Date(user.lastLoginAt)) : t('admin.users.table.never')}
      </td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                onRoleChange(user.id, user.role === 'ADMIN' ? 'USER' : 'ADMIN')
              }
            >
              <Shield className="mr-2 h-4 w-4" />
              {user.role === 'ADMIN' ? t('admin.users.table.removeAdmin') : t('admin.users.table.makeAdmin')}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              {t('admin.users.table.viewProfile')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDeleteRequest(user.id)}
              className="text-pf-danger-fg focus:text-pf-danger-fg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('admin.users.table.deleteUser')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

export function UsersTableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-16" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-8" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-24" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="ml-auto h-8 w-8" />
          </td>
        </tr>
      ))}
    </>
  );
}

interface UsersTableEmptyRowProps {
  search: string;
}

export function UsersTableEmptyRow({ search }: UsersTableEmptyRowProps) {
  const t = useT();
  return (
    <tr>
      <td colSpan={6} className="px-4 py-12">
        <EmptyState
          icon={Users}
          title={t('admin.users.noUsers')}
          description={
            search
              ? t('admin.users.adjustSearch')
              : t('admin.users.usersWillAppear')
          }
        />
      </td>
    </tr>
  );
}

interface DeleteUserDialogProps {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ open, isPending, onClose, onConfirm }: DeleteUserDialogProps) {
  const t = useT();
  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('admin.users.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('admin.users.deleteDescription')}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('action.cancel')}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isPending}>
            {t('action.delete')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
