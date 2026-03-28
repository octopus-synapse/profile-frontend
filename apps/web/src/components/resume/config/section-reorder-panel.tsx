'use client';

import { useI18n } from '@profile/i18n';
import { GripVertical, Loader2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { SectionVisibilityToggle } from './section-visibility-toggle';

export interface SectionItem {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

interface SectionReorderPanelProps {
  resumeId: string;
  sections: SectionItem[];
  onToggleVisibility: (sectionId: string, visible: boolean) => Promise<void>;
  onReorder: (sectionId: string, newOrder: number) => Promise<void>;
  onBatchUpdate?: (
    sections: Array<{ id: string; visible?: boolean; order?: number }>,
  ) => Promise<void>;
}

export function SectionReorderPanel({
  resumeId,
  sections,
  onToggleVisibility,
  onReorder,
  onBatchUpdate,
}: SectionReorderPanelProps) {
  const { t } = useI18n();
  const [items, setItems] = useState<SectionItem[]>(() =>
    [...sections].sort((a, b) => a.order - b.order),
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, overIndex: number) => {
      e.preventDefault();
      if (dragIndex === null || dragIndex === overIndex) return;

      setItems((prev) => {
        const updated = [...prev];
        const moved = updated.splice(dragIndex, 1)[0];
        if (!moved) return prev;
        updated.splice(overIndex, 0, moved);
        return updated;
      });
      setDragIndex(overIndex);
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(async () => {
    if (dragIndex === null) return;
    setDragIndex(null);
    setIsSaving(true);

    try {
      if (onBatchUpdate) {
        await onBatchUpdate(items.map((item, index) => ({ id: item.id, order: index })));
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item && item.order !== i) {
            await onReorder(item.id, i);
          }
        }
      }
    } catch {
      setItems([...sections].sort((a, b) => a.order - b.order));
    } finally {
      setIsSaving(false);
    }
  }, [dragIndex, items, sections, onReorder, onBatchUpdate]);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {t('resume.reorder.title')}
        </h3>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />}
      </div>

      <div className="space-y-1">
        {items.map((section, index) => (
          <div
            key={section.id}
            role="listitem"
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-1 rounded-md transition-colors ${
              dragIndex === index
                ? 'bg-zinc-100 dark:bg-zinc-800'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-zinc-400 active:cursor-grabbing" />
            <SectionVisibilityToggle
              resumeId={resumeId}
              sectionId={section.id}
              visible={section.visible}
              label={section.label}
              onToggle={onToggleVisibility}
            />
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="py-4 text-center text-sm text-zinc-400">{t('resume.reorder.noSections')}</p>
      )}
    </div>
  );
}
