/**
 * Section Type Form — shared types and constants.
 */

export interface TranslationFields {
  title: string;
  label: string;
  description: string;
  noDataLabel: string;
  placeholder: string;
  addLabel: string;
}

export type TranslationLocale = 'en' | 'pt-BR' | 'es';

export const LOCALES: { key: TranslationLocale; label: string }[] = [
  { key: 'en', label: 'EN' },
  { key: 'pt-BR', label: 'PT-BR' },
  { key: 'es', label: 'ES' },
];

export const EMPTY_TRANSLATION: TranslationFields = {
  title: '',
  label: '',
  description: '',
  noDataLabel: '',
  placeholder: '',
  addLabel: '',
};

export type IconType = 'emoji' | 'lucide';
export type FormMode = 'create' | 'edit';

export interface CoreFieldsValues {
  keyValue: string;
  title: string;
  description: string;
  semanticKind: string;
  iconType: IconType;
  icon: string;
  isActive: boolean;
  isRepeatable: boolean;
  minItems: number;
  maxItems: string;
}

export interface CoreFieldsHandlers {
  onKeyChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSemanticKindChange: (v: string) => void;
  onIconTypeChange: (v: IconType) => void;
  onIconChange: (v: string) => void;
  onIsActiveChange: (v: boolean) => void;
  onIsRepeatableChange: (v: boolean) => void;
  onMinItemsChange: (v: number) => void;
  onMaxItemsChange: (v: string) => void;
}
