'use client';

/**
 * Render Hints Editor
 *
 * Configures how a section type is visually rendered.
 * Maps to the backend RenderHintsSchema.
 */

import { useT } from '@profile/i18n';
import { Input, Label } from '@/shared/components/ui';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  ITEM_LAYOUTS,
  LAYOUTS,
  type ItemLayout,
  type LayoutType,
  type RenderHints,
} from './types/style-config';

interface RenderHintsEditorProps {
  renderHints: RenderHints;
  onChange: (hints: RenderHints) => void;
}

export function RenderHintsEditor({ renderHints, onChange }: RenderHintsEditorProps) {
  const t = useT();
  const update = (patch: Partial<RenderHints>) => onChange({ ...renderHints, ...patch });

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{t('admin.sectionTypes.renderHints.title')}</Label>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.renderHints.layout')}</Label>
          <Select value={renderHints.layout ?? ''} onValueChange={(v) => update({ layout: (v || undefined) as LayoutType })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={t('admin.sectionTypes.renderHints.default')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('admin.sectionTypes.renderHints.default')}</SelectItem>
              {LAYOUTS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.renderHints.itemLayout')}</Label>
          <Select value={renderHints.itemLayout ?? ''} onValueChange={(v) => update({ itemLayout: (v || undefined) as ItemLayout })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={t('admin.sectionTypes.renderHints.default')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('admin.sectionTypes.renderHints.default')}</SelectItem>
              {ITEM_LAYOUTS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.renderHints.columns')}</Label>
          <Input
            type="number"
            min={1}
            max={4}
            placeholder={t('admin.sectionTypes.renderHints.auto')}
            value={renderHints.columns ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ columns: e.target.value ? Number(e.target.value) : undefined })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.renderHints.dateFormat')}</Label>
          <Input
            placeholder="MMM YYYY"
            value={renderHints.dateFormat ?? ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ dateFormat: e.target.value || undefined })}
            className="h-8 text-sm"
          />
        </div>

        <div className="flex items-end pb-1">
          <div className="flex items-center gap-1.5">
            <Checkbox
              id="show-dividers"
              checked={renderHints.showDividers === true}
              onCheckedChange={(v) => update({ showDividers: v === true || undefined })}
            />
            <Label htmlFor="show-dividers" className="text-xs">{t('admin.sectionTypes.renderHints.showDividers')}</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
