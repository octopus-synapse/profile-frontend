'use client';

/**
 * Section Type Form Fields — re-exports for backward compatibility.
 * @deprecated Import from individual modules instead:
 *   - section-type-form.types.ts
 *   - core-fields-section.tsx
 *   - translations-section.tsx
 */

export { CoreFieldsSection } from './field-editor/core-fields-section';
export { getTranslationErrors, TranslationsSection } from './field-editor/translations-section';
export type {
  CoreFieldsHandlers,
  CoreFieldsValues,
  FormMode,
  IconType,
  TranslationFields,
  TranslationLocale,
} from './section-type-form.types';
export {
  EMPTY_TRANSLATION,
  LOCALES,
} from './section-type-form.types';

// Legacy props interface for existing consumers
export type CoreFieldsSectionProps = import('./section-type-form.types').CoreFieldsValues &
  import('./section-type-form.types').CoreFieldsHandlers & {
    mode: import('./section-type-form.types').FormMode;
    keyValue: string;
  };
