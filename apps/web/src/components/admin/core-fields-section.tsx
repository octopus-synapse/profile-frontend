'use client';

/**
 * Core Fields Section — basic section type properties.
 * Split into sub-components for readability.
 */

import { useT } from '@profile/i18n';
import { LucideIconPicker } from '@/shared/components/lucide-icon-picker';
import { Input, Label } from '@/shared/components/ui';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import type { CoreFieldsHandlers, CoreFieldsValues, FormMode } from './section-type-form.types';

interface Props extends CoreFieldsValues, CoreFieldsHandlers {
  mode: FormMode;
}

function KeyTitleRow({
  mode,
  keyValue,
  title,
  onKeyChange,
  onTitleChange,
}: Pick<Props, 'mode' | 'title' | 'onKeyChange' | 'onTitleChange'> & { keyValue: string }) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label required>{t('admin.sectionTypes.form.key')}</Label>
        <Input
          placeholder="work_experience_v1"
          value={keyValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onKeyChange(e.target.value)}
          disabled={mode === 'edit'}
        />
      </div>
      <div className="space-y-2">
        <Label required>{t('admin.sectionTypes.form.title')}</Label>
        <Input
          placeholder={t('admin.sectionTypes.form.placeholderExample')}
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTitleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function IconSelector({
  iconType,
  icon,
  onIconTypeChange,
  onIconChange,
}: Pick<Props, 'iconType' | 'icon' | 'onIconTypeChange' | 'onIconChange'>) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{t('admin.sectionTypes.form.iconType')}</Label>
        <Select value={iconType} onValueChange={onIconTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="emoji">{t('admin.sectionTypes.form.iconEmoji')}</SelectItem>
            <SelectItem value="lucide">{t('admin.sectionTypes.form.iconLucide')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>{t('admin.sectionTypes.form.icon')}</Label>
        {iconType === 'lucide' ? (
          <LucideIconPicker value={icon} onChange={onIconChange} />
        ) : (
          <Input
            placeholder="💼"
            value={icon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onIconChange(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}

function ItemLimitsRow({
  minItems,
  maxItems,
  onMinItemsChange,
  onMaxItemsChange,
}: Pick<Props, 'minItems' | 'maxItems' | 'onMinItemsChange' | 'onMaxItemsChange'>) {
  const t = useT();
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>{t('admin.sectionTypes.form.minItems')}</Label>
        <Input
          type="number"
          min={0}
          value={minItems}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onMinItemsChange(Number(e.target.value))
          }
        />
      </div>
      <div className="space-y-2">
        <Label>{t('admin.sectionTypes.form.maxItems')}</Label>
        <Input
          type="number"
          min={0}
          placeholder={t('admin.sectionTypes.form.noLimit')}
          value={maxItems}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMaxItemsChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function CoreFieldsSection(props: Props) {
  const t = useT();
  const {
    mode,
    keyValue,
    title,
    description,
    semanticKind,
    iconType,
    icon,
    isActive,
    isRepeatable,
    minItems,
    maxItems,
    onKeyChange,
    onTitleChange,
    onDescriptionChange,
    onSemanticKindChange,
    onIconTypeChange,
    onIconChange,
    onIsActiveChange,
    onIsRepeatableChange,
    onMinItemsChange,
    onMaxItemsChange,
  } = props;

  return (
    <div className="space-y-4">
      <KeyTitleRow
        mode={mode}
        keyValue={keyValue}
        title={title}
        onKeyChange={onKeyChange}
        onTitleChange={onTitleChange}
      />
      <div className="space-y-2">
        <Label>{t('admin.sectionTypes.form.description')}</Label>
        <Textarea
          placeholder={t('admin.sectionTypes.form.description')}
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onDescriptionChange(e.target.value)
          }
          rows={2}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label required>{t('admin.sectionTypes.form.semanticKind')}</Label>
          <Input
            placeholder="experience"
            value={semanticKind}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onSemanticKindChange(e.target.value)
            }
          />
        </div>
        <IconSelector
          iconType={iconType}
          icon={icon}
          onIconTypeChange={onIconTypeChange}
          onIconChange={onIconChange}
        />
      </div>
      <ItemLimitsRow
        minItems={minItems}
        maxItems={maxItems}
        onMinItemsChange={onMinItemsChange}
        onMaxItemsChange={onMaxItemsChange}
      />
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is-active"
            checked={isActive}
            onCheckedChange={(v) => onIsActiveChange(v === true)}
          />
          <Label htmlFor="is-active">{t('admin.sectionTypes.form.active')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is-repeatable"
            checked={isRepeatable}
            onCheckedChange={(v) => onIsRepeatableChange(v === true)}
          />
          <Label htmlFor="is-repeatable">{t('admin.sectionTypes.form.repeatable')}</Label>
        </div>
      </div>
    </div>
  );
}
