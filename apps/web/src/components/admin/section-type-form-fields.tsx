'use client';

/**
 * Section Type Form Fields — sub-components for the form dialog.
 */

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

// ============================================================================
// Types (shared with form dialog)
// ============================================================================

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

// ============================================================================
// Core Fields Section
// ============================================================================

export interface CoreFieldsSectionProps {
  mode: 'create' | 'edit';
  keyValue: string;
  title: string;
  description: string;
  semanticKind: string;
  iconType: string;
  icon: string;
  isActive: boolean;
  isRepeatable: boolean;
  minItems: number;
  maxItems: string;
  onKeyChange: (v: string) => void;
  onTitleChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSemanticKindChange: (v: string) => void;
  onIconTypeChange: (v: 'emoji' | 'lucide') => void;
  onIconChange: (v: string) => void;
  onIsActiveChange: (v: boolean) => void;
  onIsRepeatableChange: (v: boolean) => void;
  onMinItemsChange: (v: number) => void;
  onMaxItemsChange: (v: string) => void;
}

export function CoreFieldsSection(props: CoreFieldsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label required>Key</Label>
          <Input
            placeholder="work_experience_v1"
            value={props.keyValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onKeyChange(e.target.value)}
            disabled={props.mode === 'edit'}
          />
        </div>
        <div className="space-y-2">
          <Label required>Title</Label>
          <Input
            placeholder="Work Experience"
            value={props.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onTitleChange(e.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe this section type..."
          value={props.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            props.onDescriptionChange(e.target.value)
          }
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label required>Semantic Kind</Label>
          <Input
            placeholder="experience"
            value={props.semanticKind}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onSemanticKindChange(e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Icon Type</Label>
            <Select value={props.iconType} onValueChange={props.onIconTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="emoji">Emoji</SelectItem>
                <SelectItem value="lucide">Lucide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Icon</Label>
            <Input
              placeholder={props.iconType === 'emoji' ? '💼' : 'briefcase'}
              value={props.icon}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onIconChange(e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Items</Label>
          <Input
            type="number"
            min={0}
            value={props.minItems}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onMinItemsChange(Number(e.target.value))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Max Items</Label>
          <Input
            type="number"
            min={0}
            placeholder="No limit"
            value={props.maxItems}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onMaxItemsChange(e.target.value)
            }
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is-active"
            checked={props.isActive}
            onCheckedChange={(v) => props.onIsActiveChange(v === true)}
          />
          <Label htmlFor="is-active">Active</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is-repeatable"
            checked={props.isRepeatable}
            onCheckedChange={(v) => props.onIsRepeatableChange(v === true)}
          />
          <Label htmlFor="is-repeatable">Repeatable</Label>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Translations Section
// ============================================================================

interface TranslationsSectionProps {
  activeLocale: TranslationLocale;
  translations: Record<TranslationLocale, TranslationFields>;
  onLocaleChange: (locale: TranslationLocale) => void;
  onFieldChange: (field: keyof TranslationFields, value: string) => void;
}

export function TranslationsSection(props: TranslationsSectionProps) {
  const current = props.translations[props.activeLocale];

  return (
    <div className="space-y-4">
      <Label>Translations</Label>
      <div className="flex gap-1">
        {LOCALES.map((locale) => (
          <button
            type="button"
            key={locale.key}
            onClick={() => props.onLocaleChange(locale.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              props.activeLocale === locale.key
                ? 'bg-pf-canvas-emphasis text-pf-fg-on-emphasis'
                : 'text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default'
            }`}
          >
            {locale.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Section title"
              value={current.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onFieldChange('title', e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Label</Label>
            <Input
              placeholder="Short label"
              value={current.label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onFieldChange('label', e.target.value)
              }
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            placeholder="Section description"
            value={current.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              props.onFieldChange('description', e.target.value)
            }
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>No Data Label</Label>
            <Input
              placeholder="No items yet"
              value={current.noDataLabel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onFieldChange('noDataLabel', e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Placeholder</Label>
            <Input
              placeholder="Add your..."
              value={current.placeholder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onFieldChange('placeholder', e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Add Label</Label>
            <Input
              placeholder="+ Add item"
              value={current.addLabel}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onFieldChange('addLabel', e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
