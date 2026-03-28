/**
 * Section Type Form — Payload builders and state helpers
 *
 * Extracted from section-type-form-dialog.tsx to keep files under 300 lines.
 */

import {
  EMPTY_TRANSLATION,
  LOCALES,
  type TranslationFields,
  type TranslationLocale,
} from './section-type-form-fields';
import type {
  CreateSectionTypePayload,
  SectionTypeData,
  SectionTypeTranslation,
  UpdateSectionTypePayload,
} from './types/section-types';
import type { FieldStylesMap, RenderHints } from './types/style-config';

export function buildTranslationState(
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

export function buildTranslationsPayload(
  translations: Record<TranslationLocale, TranslationFields>,
): Record<string, Partial<SectionTypeTranslation>> {
  const payload: Record<string, Partial<SectionTypeTranslation>> = {};
  for (const locale of LOCALES) {
    const t = translations[locale.key];
    if (t.title) payload[locale.key] = stripEmpty(t);
  }
  return payload;
}

export interface CreateFields {
  key: string;
  title: string;
  description: string;
  semanticKind: string;
  iconType: string;
  icon: string;
  isRepeatable: boolean;
  minItems: number;
}

export function buildCreatePayload(
  fields: CreateFields,
  maxItems: number | null,
  translations: Record<string, Partial<SectionTypeTranslation>>,
  definition: Record<string, unknown>,
  renderHints: RenderHints,
  fieldStyles: FieldStylesMap,
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
    definition,
    renderHints: renderHints as Record<string, unknown>,
    fieldStyles: fieldStyles as Record<string, unknown>,
    translations,
  };
}

export interface UpdateFields {
  title: string;
  description: string;
  isActive: boolean;
  isRepeatable: boolean;
  iconType: string;
  icon: string;
  minItems: number;
}

export function buildUpdatePayload(
  fields: UpdateFields,
  maxItems: number | null,
  translations: Record<string, Partial<SectionTypeTranslation>>,
  definition: Record<string, unknown>,
  renderHints: RenderHints,
  fieldStyles: FieldStylesMap,
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
    definition,
    renderHints: renderHints as Record<string, unknown>,
    fieldStyles: fieldStyles as Record<string, unknown>,
    translations,
  };
}
