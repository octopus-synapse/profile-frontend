'use client';

/**
 * Section Types Table Parts
 *
 * Sub-components for the section types table: row, pagination,
 * loading skeleton, and delete confirmation dialog.
 */

import { useT } from '@profile/i18n';
import { ChevronLeft, ChevronRight, Edit, MoreVertical, Trash2 } from 'lucide-react';
import { SectionIcon } from '@/shared/components/section-icon';
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
  const t = useT();
  return (
    <thead className="bg-pf-canvas-subtle border-pf-border-default border-b">
      <tr>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
          {t('admin.sectionTypes.table.section')}
        </th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
          {t('admin.sectionTypes.table.title')}
        </th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
          {t('admin.sectionTypes.table.semanticKind')}
        </th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
          {t('admin.sectionTypes.table.status')}
        </th>
        <th className="text-pf-fg-muted px-4 py-3 text-left text-sm font-medium">
          {t('admin.sectionTypes.table.system')}
        </th>
        <th className="text-pf-fg-muted px-4 py-3 text-right text-sm font-medium">
          {t('admin.sectionTypes.table.actions')}
        </th>
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
  const t = useT();
  return (
    <tr className="hover:bg-pf-canvas-subtle/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <SectionIcon iconType={item.iconType} icon={item.icon || '📄'} size={20} />
          <code className="text-pf-fg-default text-sm font-medium">{item.key}</code>
        </div>
      </td>
      <td className="text-pf-fg-muted px-4 py-3 text-sm">{item.title}</td>
      <td className="px-4 py-3">
        <Badge variant="secondary">{item.semanticKind}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={item.isActive ? 'success' : 'outline'}>
          {item.isActive ? t('admin.sectionTypes.active') : t('admin.sectionTypes.inactive')}
        </Badge>
      </td>
      <td className="px-4 py-3">
        {item.isSystem && (
          <Badge variant="warning">{t('admin.sectionTypes.table.systemBadge')}</Badge>
        )}
      </td>
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
              {t('action.edit')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(item)}
              disabled={item.isSystem}
              className="text-pf-danger-fg focus:text-pf-danger-fg"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('action.delete')}
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
  const t = useT();
  return (
    <div className="border-pf-border-default flex items-center justify-between border-t px-4 py-3">
      <p className="text-pf-fg-muted text-sm">
        {t('admin.sectionTypes.table.showing', {
          from: (page - 1) * pageSize + 1,
          to: Math.min(page * pageSize, total),
          total,
        })}
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
          {t('admin.sectionTypes.table.page', { current: page, total: totalPages })}
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
  const t = useT();
  return (
    <Dialog open={!!target} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('admin.sectionTypes.deleteTitle')}</DialogTitle>
          <DialogDescription>
            {t('admin.sectionTypes.deleteConfirm')} <strong>{target?.key}</strong>? This action
            cannot be undone. All associated section data may be affected.
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
