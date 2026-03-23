'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useI18n } from '@profile/i18n';
import type { FieldDefinition, SectionItem } from '../types/generic-section.types';

interface SectionItemListProps {
  items: SectionItem[];
  fields: FieldDefinition[];
  onEdit: (item: SectionItem) => void;
  onDelete: (itemId: string) => void;
  isDeleting: boolean;
}

export function SectionItemList({
  items,
  fields,
  onEdit,
  onDelete,
  isDeleting,
}: SectionItemListProps) {
  const { t } = useI18n();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
        <p className="text-sm text-zinc-400">{t('resume.section.noItems')}</p>
      </div>
    );
  }

  const titleField = fields.find(
    (f) =>
      f.semanticRole === 'TITLE' ||
      f.key === 'title' ||
      f.key === 'company' ||
      f.key === 'institution' ||
      f.key === 'name',
  );
  const subtitleField = fields.find(
    (f) =>
      f.semanticRole === 'SUBTITLE' ||
      f.key === 'position' ||
      f.key === 'role' ||
      f.key === 'degree' ||
      f.key === 'level',
  );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="group rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-white">
                {titleField ? String(item.content[titleField.key] || t('resume.section.untitled')) : t('resume.section.item')}
              </h4>
              {subtitleField && item.content[subtitleField.key] != null && (
                <p className="mt-1 text-sm text-zinc-400">
                  {String(item.content[subtitleField.key])}
                </p>
              )}
            </div>
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label={t('action.edit')}
              >
                <Pencil className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => void onDelete(item.id)}
                disabled={isDeleting}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-red-400 disabled:opacity-50"
                aria-label={t('action.delete')}
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
