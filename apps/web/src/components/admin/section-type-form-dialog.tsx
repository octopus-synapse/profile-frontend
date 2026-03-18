'use client';

/**
 * Section Type Form Dialog
 *
 * Dialog for creating and editing section type definitions.
 * Sub-components extracted to section-type-form-fields.tsx.
 */

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
import { useSectionTypeCreate, useSectionTypeUpdate } from './hooks';
import {
  CoreFieldsSection,
  EMPTY_TRANSLATION,
  LOCALES,
  type TranslationFields,
  type TranslationLocale,
  TranslationsSection,
} from './section-type-form-fields';
import type {
  CreateSectionTypePayload,
  SectionTypeData,
  SectionTypeTranslation,
  UpdateSectionTypePayload,
} from './types/section-types';

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

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    if (!key.trim() || !title.trim() || !semanticKind.trim()) {
      showToast.error('Key, title, and semantic kind are required');
      return;
    }

    const translationsPayload = buildTranslationsPayload(translations);
    const parsedMaxItems = maxItems ? Number(maxItems) : null;

    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(
          buildCreatePayload(
            { key, title, description, semanticKind, iconType, icon, isRepeatable, minItems },
            parsedMaxItems,
            translationsPayload,
          ),
        );
        showToast.success('Section type created');
      } else {
        await updateMutation.mutateAsync({
          key,
          payload: buildUpdatePayload(
            { title, description, isActive, isRepeatable, iconType, icon, minItems },
            parsedMaxItems,
            translationsPayload,
          ),
        });
        showToast.success('Section type updated');
      }
      onOpenChange(false);
    } catch {
      showToast.error(`Failed to ${mode} section type`);
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
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create Section Type' : 'Edit Section Type'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Define a new resume section type with translations'
              : `Editing section type: ${sectionType?.key}`}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => void handleSubmit()} loading={isPending}>
            {mode === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function buildTranslationState(
  sectionType?: SectionTypeData | null,
): Record<TranslationLocale, TranslationFields> {
  const base: Record<TranslationLocale, TranslationFields> = {
    en: { ...EMPTY_TRANSLATION },
    'pt-BR': { ...EMPTY_TRANSLATION },
    es: { ...EMPTY_TRANSLATION },
  };

  if (!sectionType?.translations) return base;

  for (const locale of LOCALES) {
    const existing = sectionType.translations[locale.key];
    if (existing) {
      base[locale.key] = {
        title: existing.title ?? '',
        label: existing.label ?? '',
        description: existing.description ?? '',
        noDataLabel: existing.noDataLabel ?? '',
        placeholder: existing.placeholder ?? '',
        addLabel: existing.addLabel ?? '',
      };
    }
  }

  return base;
}

function stripEmpty(obj: TranslationFields): Partial<TranslationFields> {
  const result: Partial<TranslationFields> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v) result[k as keyof TranslationFields] = v;
  }
  return result;
}

function buildTranslationsPayload(
  translations: Record<TranslationLocale, TranslationFields>,
): Record<string, Partial<SectionTypeTranslation>> {
  const payload: Record<string, Partial<SectionTypeTranslation>> = {};
  for (const locale of LOCALES) {
    const t = translations[locale.key];
    if (t.title) payload[locale.key] = stripEmpty(t);
  }
  return payload;
}

interface CreateFields {
  key: string;
  title: string;
  description: string;
  semanticKind: string;
  iconType: string;
  icon: string;
  isRepeatable: boolean;
  minItems: number;
}

function buildCreatePayload(
  fields: CreateFields,
  maxItems: number | null,
  translations: Record<string, Partial<SectionTypeTranslation>>,
): CreateSectionTypePayload {
  return {
    key: fields.key.trim(),
    slug: fields.key.trim().replace(/_/g, '-'),
    title: fields.title.trim(),
    description: fields.description.trim() || undefined,
    semanticKind: fields.semanticKind.trim(),
    iconType: fields.iconType as 'emoji' | 'lucide',
    icon: fields.icon.trim(),
    isRepeatable: fields.isRepeatable,
    minItems: fields.minItems,
    maxItems: maxItems ?? undefined,
    definition: {},
    translations,
  };
}

interface UpdateFields {
  title: string;
  description: string;
  isActive: boolean;
  isRepeatable: boolean;
  iconType: string;
  icon: string;
  minItems: number;
}

function buildUpdatePayload(
  fields: UpdateFields,
  maxItems: number | null,
  translations: Record<string, Partial<SectionTypeTranslation>>,
): UpdateSectionTypePayload {
  return {
    title: fields.title.trim(),
    description: fields.description.trim() || null,
    isActive: fields.isActive,
    isRepeatable: fields.isRepeatable,
    iconType: fields.iconType as 'emoji' | 'lucide',
    icon: fields.icon.trim(),
    minItems: fields.minItems,
    maxItems,
    translations,
  };
}
