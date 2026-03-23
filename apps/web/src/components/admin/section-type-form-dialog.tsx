'use client';

/**
 * Section Type Form Dialog
 *
 * Dialog for creating and editing section type definitions.
 * Sub-components extracted to section-type-form-fields.tsx.
 */

import { useT } from '@profile/i18n';
import { useState } from 'react';
import { Button } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import { AtsConfigEditor } from './ats-config-editor';
import { FieldDefinitionEditor } from './field-definition-editor';
import { FieldStylesEditor } from './field-styles-editor';
import { useSectionTypeCreate, useSectionTypeUpdate } from './hooks';
import { RenderHintsEditor } from './render-hints-editor';
import {
  CoreFieldsSection,
  getTranslationErrors,
  type TranslationFields,
  type TranslationLocale,
  TranslationsSection,
} from './section-type-form-fields';
import {
  buildCreatePayload,
  buildTranslationState,
  buildTranslationsPayload,
  buildUpdatePayload,
} from './section-type-form-helpers';
import type { SectionTypeData } from './types/section-types';
import { parseDefinition, serializeDefinition, type FieldDefinition } from './types/field-definition';
import { parseRenderHints, parseFieldStyles, type RenderHints, type FieldStylesMap } from './types/style-config';

// ============================================================================
// Types
// ============================================================================

interface SectionTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  sectionType?: SectionTypeData | null;
}

// ============================================================================
// Component
// ============================================================================

export function SectionTypeFormDialog({
  open,
  onOpenChange,
  mode,
  sectionType,
}: SectionTypeFormDialogProps) {
  const t = useT();
  const createMutation = useSectionTypeCreate();
  const updateMutation = useSectionTypeUpdate();

  const [key, setKey] = useState(sectionType?.key ?? '');
  const [title, setTitle] = useState(sectionType?.title ?? '');
  const [description, setDescription] = useState(sectionType?.description ?? '');
  const [semanticKind, setSemanticKind] = useState(sectionType?.semanticKind ?? '');
  const [iconType, setIconType] = useState(sectionType?.iconType ?? 'emoji');
  const [icon, setIcon] = useState(sectionType?.icon ?? '');
  const [isActive, setIsActive] = useState(sectionType?.isActive ?? true);
  const [isRepeatable, setIsRepeatable] = useState(sectionType?.isRepeatable ?? true);
  const [minItems, setMinItems] = useState(sectionType?.minItems ?? 0);
  const [maxItems, setMaxItems] = useState<string>(
    sectionType?.maxItems != null ? String(sectionType.maxItems) : '',
  );
  const [activeLocale, setActiveLocale] = useState<TranslationLocale>('en');
  const [translations, setTranslations] = useState<Record<TranslationLocale, TranslationFields>>(
    () => buildTranslationState(sectionType),
  );
  const [definition, setDefinition] = useState<FieldDefinition>(
    () => parseDefinition(sectionType?.definition ?? {}),
  );
  const [renderHints, setRenderHints] = useState<RenderHints>(
    () => parseRenderHints(sectionType?.renderHints),
  );
  const [fieldStyles, setFieldStyles] = useState<FieldStylesMap>(
    () => parseFieldStyles(sectionType?.fieldStyles),
  );

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    if (!key.trim() || !title.trim() || !semanticKind.trim()) {
      showToast.error(t('admin.sectionTypes.form.requiredFields'));
      return;
    }

    const translationErrors = getTranslationErrors(translations);
    if (translationErrors.length > 0) {
      showToast.error(t('admin.sectionTypes.form.translationIncomplete', { error: translationErrors[0] }));
      return;
    }

    const translationsPayload = buildTranslationsPayload(translations);
    const parsedMaxItems = maxItems ? Number(maxItems) : null;
    const serializedDefinition = serializeDefinition({ ...definition, kind: semanticKind });

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(
          buildCreatePayload(
            { key, title, description, semanticKind, iconType, icon, isRepeatable, minItems },
            parsedMaxItems,
            translationsPayload,
            serializedDefinition,
            renderHints,
            fieldStyles,
          ),
        );
        showToast.success(t('admin.sectionTypes.form.created'));
      } else {
        await updateMutation.mutateAsync({
          key,
          payload: buildUpdatePayload(
            { title, description, isActive, isRepeatable, iconType, icon, minItems },
            parsedMaxItems,
            translationsPayload,
            serializedDefinition,
            renderHints,
            fieldStyles,
          ),
        });
        showToast.success(t('admin.sectionTypes.form.updated'));
      }
      onOpenChange(false);
    } catch {
      showToast.error(t('admin.sectionTypes.form.saveFailed'));
    }
  };

  const updateTranslation = (field: keyof TranslationFields, value: string) => {
    setTranslations((prev) => ({
      ...prev,
      [activeLocale]: { ...prev[activeLocale], [field]: value },
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? t('admin.sectionTypes.form.createTitle') : t('admin.sectionTypes.form.editTitle')}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? t('admin.sectionTypes.form.createDescription')
              : t('admin.sectionTypes.form.editDescription', { key: sectionType?.key ?? '' })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <CoreFieldsSection
            mode={mode}
            keyValue={key}
            title={title}
            description={description}
            semanticKind={semanticKind}
            iconType={iconType}
            icon={icon}
            isActive={isActive}
            isRepeatable={isRepeatable}
            minItems={minItems}
            maxItems={maxItems}
            onKeyChange={setKey}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSemanticKindChange={setSemanticKind}
            onIconTypeChange={setIconType}
            onIconChange={setIcon}
            onIsActiveChange={setIsActive}
            onIsRepeatableChange={setIsRepeatable}
            onMinItemsChange={setMinItems}
            onMaxItemsChange={setMaxItems}
          />

          <TranslationsSection
            activeLocale={activeLocale}
            translations={translations}
            onLocaleChange={setActiveLocale}
            onFieldChange={updateTranslation}
          />

          <FieldDefinitionEditor definition={definition} onChange={setDefinition} />

          <AtsConfigEditor
            atsConfig={definition.ats}
            fields={definition.fields}
            onChange={(ats) => setDefinition((prev) => ({ ...prev, ats }))}
          />

          <RenderHintsEditor renderHints={renderHints} onChange={setRenderHints} />

          <FieldStylesEditor fields={definition.fields} fieldStyles={fieldStyles} onChange={setFieldStyles} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('action.cancel')}
          </Button>
          <Button onClick={() => void handleSubmit()} loading={isPending}>
            {mode === 'create' ? t('admin.sectionTypes.form.createButton') : t('admin.sectionTypes.form.saveButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
