"use client";

/**
 * Admin Users Table Component
 */

import { useState } from "react";
import { Card, Input, Button, Badge, Avatar, Skeleton } from "@/shared/components/ui";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Search,
  MoreVertical,
  Shield,
  Trash2,
  User,
  Users,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminUsers, useAdminDeleteUser, useAdminUpdateUserRole } from "@/features/users";
import { formatDistanceToNow, formatDate } from "@/shared/utils/date";
import { showToast } from "@/shared/components/ui/toast";
import type { AdminUserFilters, UserRole } from "@/features/users";

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const filters: AdminUserFilters = {
    search: search || undefined,
    role: roleFilter !== "all" ? (roleFilter as UserRole) : undefined,
    page,
    limit: 10,
  };

  const { data, isLoading } = useAdminUsers(filters);
  const deleteUser = useAdminDeleteUser();
  const updateRole = useAdminUpdateUserRole();

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;

    try {
      await deleteUser.mutateAsync(deleteUserId);
      showToast.success("User deleted successfully");
      setDeleteUserId(null);
    } catch {
      showToast.error("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await updateRole.mutateAsync({ userId, role: newRole });
      showToast.success("User role updated");
    } catch {
      showToast.error("Failed to update role");
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
              placeholder="Search users..."
              value={search}
              onChange={(e) => {
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
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-pf-canvas-subtle border-pf-border-default border-b">
              <tr>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">User</th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Role</th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  Resumes
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Joined</th>
                <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
                  Last Login
                </th>
                <th className="text-pf-fg-muted px-4 py-3 text-right text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-pf-border-muted divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
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
                ))
              ) : !data?.users || data.users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12">
                    <EmptyState
                      icon={Users}
                      title="No users found"
                      description={
                        search
                          ? "Try adjusting your search or filters"
                          : "Users will appear here once they sign up"
                      }
                    />
                  </td>
                </tr>
              ) : (
                data.users.map((user) => (
                  <tr key={user.id} className="hover:bg-pf-canvas-subtle/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.image}
                          alt={user.name ?? "User"}
                          fallback={getInitials(user.name ?? user.email)}
                          size="md"
                        />
                        <div>
                          <p className="text-pf-fg-default text-sm font-medium">
                            {user.name ?? "No name"}
                          </p>
                          <p className="text-pf-fg-muted text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === "ADMIN" ? "warning" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="text-pf-fg-muted px-4 py-3 text-sm">{user.resumeCount}</td>
                    <td className="text-pf-fg-muted px-4 py-3 text-sm">
                      {formatDate(new Date(user.createdAt))}
                    </td>
                    <td className="text-pf-fg-muted px-4 py-3 text-sm">
                      {user.lastLoginAt ? formatDistanceToNow(new Date(user.lastLoginAt)) : "Never"}
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
                              void handleRoleChange(
                                user.id,
                                user.role === "ADMIN" ? "USER" : "ADMIN"
                              )
                            }
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            {user.role === "ADMIN" ? "Remove Admin" : "Make Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteUserId(user.id)}
                            className="text-pf-danger-fg focus:text-pf-danger-fg"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="border-pf-border-default flex items-center justify-between border-t px-4 py-3">
            <p className="text-pf-fg-muted text-sm">
              Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.total)} of {data.total}{" "}
              users
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
                Page {page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone. All their
              data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDeleteUser()}
              loading={deleteUser.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
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
