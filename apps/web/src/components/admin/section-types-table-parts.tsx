'use client';

/**
 * Section Types Table Parts
 *
 * Sub-components for the section types table: row, pagination,
 * loading skeleton, and delete confirmation dialog.
 */

import { ChevronLeft, ChevronRight, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { Badge, Button, Skeleton } from '@/shared/components/ui';
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
import type { SectionTypeData } from './types/section-types';

// ============================================================================
// Table Header
// ============================================================================

export function TableHeader() {
  return (
    <thead className="bg-pf-canvas-subtle border-pf-border-default border-b">
      <tr>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Section</th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Title</th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Semantic Kind</th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">Status</th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">System</th>
        <th className="text-pf-fg-muted px-4 py-3 text-right text-sm font-medium">Actions</th>
      </tr>
    </thead>
  );
}

// ============================================================================
// Loading Skeleton
// ============================================================================

export function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-4 w-28" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-20" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-16" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="h-6 w-16" />
          </td>
          <td className="px-4 py-3">
            <Skeleton className="ml-auto h-8 w-8" />
          </td>
        </tr>
      ))}
    </>
  );
}

// ============================================================================
// Section Type Row
// ============================================================================

interface SectionTypeRowProps {
  item: SectionTypeData;
  onEdit: (item: SectionTypeData) => void;
  onDelete: (item: SectionTypeData) => void;
}

export function SectionTypeRow({ item, onEdit, onDelete }: SectionTypeRowProps) {
  return (
    <tr className="hover:bg-pf-canvas-subtle/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-lg" title={item.iconType}>
            {item.icon || '📄'}
          </span>
          <code className="text-pf-fg-default text-sm font-medium">{item.key}</code>
        </div>
      </td>
      <td className="text-pf-fg-muted px-4 py-3 text-sm">{item.title}</td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{item.semanticKind}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={item.isActive ? 'success' : 'outline'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </td>
      <td className="px-4 py-3">{item.isSystem && <Badge variant="warning">System</Badge>}</td>
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              disabled={item.isSystem}
              className="text-pf-danger-fg focus:text-pf-danger-fg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

// ============================================================================
// Pagination
// ============================================================================

interface PaginationProps {
  page: number;
  pageSize: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  page,
  pageSize,
  totalPages,
  total,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="border-pf-border-default flex items-center justify-between border-t px-4 py-3">
      <p className="text-pf-fg-muted text-sm">
        Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} section
        types
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-pf-fg-muted text-sm">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Delete Confirmation
// ============================================================================

interface DeleteConfirmDialogProps {
  target: SectionTypeData | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  target,
  isPending,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={!!target} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Section Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{target?.key}</strong>? This action cannot be
            undone. All associated section data may be affected.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isPending}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
