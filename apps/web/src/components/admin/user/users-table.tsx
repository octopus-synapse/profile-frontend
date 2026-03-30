'use client';

/**
 * Admin Users Table Component
 */

import {
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  showToast,
} from '@octopus-synapse/profile-ui';
import {
  type AdminUpdateUserDtoRole,
  type UsersListUsersParams,
  useUsersDeleteUser,
  useUsersListUsers,
  useUsersUpdateUser,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';
import { useState } from 'react';
import {
  DeleteUserDialog,
  UsersTableEmptyRow,
  UsersTableRow,
  UsersTableSkeletonRows,
} from './users-table-parts';

export function UsersTable() {
  const t = useT();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const params: UsersListUsersParams = {
    search: search || undefined,
    roleName: roleFilter !== 'all' ? roleFilter : undefined,
    page,
    limit: 10,
  };

  const { data: response, isLoading } = useUsersListUsers(params);
  const deleteUser = useUsersDeleteUser();
  const updateUser = useUsersUpdateUser();

  const data = response?.data?.data;

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      await deleteUser.mutateAsync({ id: deleteUserId });
      showToast.success(t('admin.users.deleteSuccess'));
      setDeleteUserId(null);
    } catch {
      showToast.error(t('admin.users.deleteFailed'));
    }
  };

  const handleRoleChange = async (userId: string, newRole: AdminUpdateUserDtoRole) => {
    try {
      await updateUser.mutateAsync({ id: userId, data: { role: newRole } });
      showToast.success(t('admin.users.roleUpdated'));
    } catch {
      showToast.error(t('admin.users.roleUpdateFailed'));
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative max-w-sm flex-1">
            <Search className="text-pf-fg-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder={t('admin.users.search')}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) => {
              setRoleFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder={t('admin.users.filterByRole')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.users.filterAllRoles')}</SelectItem>
              <SelectItem value="USER">{t('admin.role.user')}</SelectItem>
              <SelectItem value="ADMIN">{t('admin.role.admin')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {t('action.export')}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pf-canvas-subtle border-pf-border-default border-b">
              <tr>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  {t('admin.users.table.user')}
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  {t('admin.users.table.role')}
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  {t('admin.users.table.resumes')}
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  {t('admin.users.table.joined')}
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  {t('admin.users.table.lastLogin')}
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-right text-sm font-medium">
                  {t('admin.users.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-pf-border-muted divide-y">
              {isLoading ? (
                <UsersTableSkeletonRows />
              ) : !data?.users || data.users.length === 0 ? (
                <UsersTableEmptyRow search={search} />
              ) : (
                data.users.map((user) => (
                  <UsersTableRow
                    key={user.id}
                    user={user}
                    onRoleChange={(id, role) => void handleRoleChange(id, role)}
                    onDeleteRequest={setDeleteUserId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="border-pf-border-default flex items-center justify-between border-t px-4 py-3">
            <p className="text-pf-fg-muted text-sm">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.pagination.total)} of{' '}
              {data.pagination.total} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-pf-fg-muted text-sm">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      <DeleteUserDialog
        open={!!deleteUserId}
        isPending={deleteUser.isPending}
        onClose={() => setDeleteUserId(null)}
        onConfirm={() => void handleDeleteUser()}
      />
    </div>
  );
}
