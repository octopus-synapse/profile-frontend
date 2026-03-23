'use client';

/**
 * Field Row — Single field entry editor within the definition editor.
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
import { FIELD_TYPES, SEMANTIC_ROLES, WIDGETS, type FieldEntry, type FieldType } from './types/field-definition';

interface FieldRowProps {
  field: FieldEntry;
  index: number;
  onChange: (index: number, field: FieldEntry) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

export function FieldRow({ field, index, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: FieldRowProps) {
  const t = useT();
  const update = (patch: Partial<FieldEntry>) => onChange(index, { ...field, ...patch });
  const updateMeta = (patch: Partial<FieldEntry['meta']>) => update({ meta: { ...field.meta, ...patch } });

  return (
    <div className="border-pf-border-default rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-pf-fg-muted text-xs font-mono">#{index + 1}</span>
        <div className="flex items-center gap-1">
          <button type="button" disabled={isFirst} onClick={() => onMoveUp(index)} className="rounded px-2 py-0.5 text-xs hover:bg-pf-canvas-subtle disabled:opacity-30" title={t('admin.sectionTypes.fields.moveUp')}>↑</button>
          <button type="button" disabled={isLast} onClick={() => onMoveDown(index)} className="rounded px-2 py-0.5 text-xs hover:bg-pf-canvas-subtle disabled:opacity-30" title={t('admin.sectionTypes.fields.moveDown')}>↓</button>
          <button type="button" onClick={() => onRemove(index)} className="rounded px-2 py-0.5 text-xs text-red-500 hover:bg-red-50" title={t('admin.sectionTypes.fields.remove')}>✕</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.key')}</Label>
          <Input placeholder="fieldKey" value={field.key} onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ key: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.label')}</Label>
          <Input placeholder={t('admin.sectionTypes.fields.displayName')} value={field.meta.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMeta({ label: e.target.value })} className="h-8 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.type')}</Label>
          <Select value={field.type} onValueChange={(v) => update({ type: v as FieldType })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FIELD_TYPES.map((t: FieldType) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.semanticRole')}</Label>
          <Select value={field.semanticRole} onValueChange={(v) => update({ semanticRole: v })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEMANTIC_ROLES.map((r: string) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.widget')}</Label>
          <Select value={field.meta.widget ?? 'text'} onValueChange={(v) => updateMeta({ widget: v as FieldEntry['meta']['widget'] })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              {WIDGETS.map((w: string) => <SelectItem key={w} value={w!}>{w}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-4 pb-1">
          <div className="flex items-center gap-1.5">
            <Checkbox id={`req-${index}`} checked={field.required} onCheckedChange={(v) => update({ required: v === true })} />
            <Label htmlFor={`req-${index}`} className="text-xs">{t('admin.sectionTypes.fields.required')}</Label>
          </div>
          <div className="flex items-center gap-1.5">
            <Checkbox id={`null-${index}`} checked={field.nullable === true} onCheckedChange={(v) => update({ nullable: v === true || undefined })} />
            <Label htmlFor={`null-${index}`} className="text-xs">{t('admin.sectionTypes.fields.nullable')}</Label>
          </div>
        </div>
      </div>

      {field.type === 'enum' && (
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.fields.enumValues')}</Label>
          <Input
            placeholder={t('admin.sectionTypes.fields.enumPlaceholder')}
            value={(field.enum ?? []).join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ enum: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })}
            className="h-8 text-sm"
          />
        </div>
      )}

      {field.type === 'string' && (
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">{t('admin.sectionTypes.fields.format')}</Label>
            <Select value={field.meta.format ?? ''} onValueChange={(v) => updateMeta({ format: (v || undefined) as FieldEntry['meta']['format'] })}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={t('admin.sectionTypes.fields.none')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('admin.sectionTypes.fields.none')}</SelectItem>
                <SelectItem value="uri">{t('admin.sectionTypes.fields.formatUri')}</SelectItem>
                <SelectItem value="email">{t('admin.sectionTypes.fields.formatEmail')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t('admin.sectionTypes.fields.minLength')}</Label>
            <Input type="number" min={0} value={field.meta.minLength ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMeta({ minLength: e.target.value ? Number(e.target.value) : undefined })} className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t('admin.sectionTypes.fields.maxLength')}</Label>
            <Input type="number" min={0} value={field.meta.maxLength ?? ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateMeta({ maxLength: e.target.value ? Number(e.target.value) : undefined })} className="h-8 text-sm" />
          </div>
        </div>
      )}

      {field.type === 'date' && (
        <div className="flex items-center gap-1.5">
          <Checkbox id={`present-${index}`} checked={field.meta.allowPresentFlag === true} onCheckedChange={(v) => updateMeta({ allowPresentFlag: v === true || undefined })} />
          <Label htmlFor={`present-${index}`} className="text-xs">{t('admin.sectionTypes.fields.allowPresent')}</Label>
        </div>
      )}
    </div>
  );
}
