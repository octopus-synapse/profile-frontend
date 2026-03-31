'use client';

/**
 * Admin Section Types Table
 *
 * Lists, filters, and manages resume section type definitions.
 * Sub-components extracted to section-types-table-parts.tsx.
 */

import {
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  showToast,
} from '@octopus-synapse/profile-ui';
import {
  useAdminSectionTypesFindAll,
  useAdminSectionTypesGetSemanticKinds,
  useAdminSectionTypesRemove,
} from '@profile/api-client';
import { useT } from '@profile/i18n';
import { Layers, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import type { SectionTypeData, SectionTypeListParams } from '../types/section-types';
import { SectionTypeFormDialog } from './section-type-form-dialog';
import {
  DeleteConfirmDialog,
  LoadingRows,
  SectionTypeRow,
  TableHeader,
  TablePagination,
} from './section-types-table-parts';

const PAGE_SIZE = 10;

export function SectionTypesTable() {
  const t = useT();
  const [search, setSearch] = useState('');
  const [semanticKindFilter, setSemanticKindFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editTarget, setEditTarget] = useState<SectionTypeData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SectionTypeData | null>(null);

  const params: SectionTypeListParams = {
    search: search || undefined,
    semanticKind: semanticKindFilter !== 'all' ? semanticKindFilter : undefined,
    isActive: activeFilter === 'all' ? undefined : activeFilter === 'active',
    page,
    limit: PAGE_SIZE,
  };

  const { data: listResponse, isLoading } = useAdminSectionTypesFindAll(params);
  const { data: kindsResponse } = useAdminSectionTypesGetSemanticKinds();
  const deleteMutation = useAdminSectionTypesRemove();

  const data = listResponse?.status === 200 ? listResponse.data.data : null;
  const semanticKinds = kindsResponse?.status === 200 ? kindsResponse.data.data : [];

  const handleCreate = () => {
    setEditTarget(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEdit = (item: SectionTypeData) => {
    setEditTarget(item);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      await deleteMutation.mutateAsync({ key: deleteTarget.key });
      showToast.success(t('admin.sectionTypes.deleted'));
      setDeleteTarget(null);
    } catch {
      showToast.error(t('admin.sectionTypes.deleteFailed'));
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
              placeholder={t('admin.sectionTypes.search')}
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={semanticKindFilter}
            onValueChange={(v) => {
              setSemanticKindFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('admin.sectionTypes.filterSemanticKind')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.sectionTypes.allKinds')}</SelectItem>
              {((semanticKinds as string[]) ?? []).map((kind: string) => (
                <SelectItem key={kind} value={kind}>
                  {kind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={activeFilter}
            onValueChange={(v) => {
              setActiveFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder={t('admin.sectionTypes.filterStatus')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.sectionTypes.statusAll')}</SelectItem>
              <SelectItem value="active">{t('admin.sectionTypes.active')}</SelectItem>
              <SelectItem value="inactive">{t('admin.sectionTypes.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.sectionTypes.new')}
        </Button>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader />
            <tbody className="divide-pf-border-muted divide-y">
              {isLoading ? (
                <LoadingRows />
              ) : !data?.items || data.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12">
                    <EmptyState
                      icon={Layers}
                      title={t('admin.sectionTypes.notFound')}
                      description={
                        search
                          ? t('admin.sectionTypes.adjustSearch')
                          : t('admin.sectionTypes.willAppear')
                      }
                    />
                  </td>
                </tr>
              ) : (
                (data.items as unknown as SectionTypeData[]).map((item: SectionTypeData) => (
                  <SectionTypeRow
                    key={item.key}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <TablePagination
            page={page}
            pageSize={PAGE_SIZE}
            totalPages={data.totalPages}
            total={data.total}
            onPageChange={setPage}
          />
        )}
      </Card>

      {/* Dialogs */}
      <DeleteConfirmDialog
        target={deleteTarget}
        isPending={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeleteConfirm()}
      />

      <SectionTypeFormDialog
        key={editTarget?.key ?? 'create'}
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        sectionType={editTarget}
      />
    </div>
  );
}
