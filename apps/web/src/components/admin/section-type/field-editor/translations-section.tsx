'use client';

/**
 * Translations Section — i18n fields for section types.
 */

import { Button, Input, Label } from '@octopus-synapse/profile-ui';
import { useT } from '@profile/i18n';
import type { TranslationFields, TranslationLocale } from '../section-type-form.types';
import { LOCALES } from '../section-type-form.types';

interface Props {
  activeLocale: TranslationLocale;
  translations: Record<TranslationLocale, TranslationFields>;
  onLocaleChange: (locale: TranslationLocale) => void;
  onFieldChange: (field: keyof TranslationFields, value: string) => void;
}

function isLocaleComplete(fields: TranslationFields): boolean {
  return Boolean(fields.title.trim() && fields.label.trim());
}

export function getTranslationErrors(
  translations: Record<TranslationLocale, TranslationFields>,
): string[] {
  const errors: string[] = [];
  for (const locale of LOCALES) {
    const fields = translations[locale.key];
    if (!fields.title.trim()) errors.push(`${locale.label}: title is required`);
    if (!fields.label.trim()) errors.push(`${locale.label}: label is required`);
  }
  return errors;
}

function LocaleTabs({
  activeLocale,
  translations,
  onLocaleChange,
}: Pick<Props, 'activeLocale' | 'translations' | 'onLocaleChange'>) {
  return (
    <div className="flex gap-1">
      {LOCALES.map((locale) => {
        const complete = isLocaleComplete(translations[locale.key]);
        const isActive = activeLocale === locale.key;
        return (
          <Button
            key={locale.key}
            type="button"
            variant={isActive ? 'solid' : 'ghost'}
            tone="neutral"
            size="xs"
            leftIcon={
              <span
                className={`inline-block h-2 w-2 rounded-full ${complete ? 'bg-green-500' : 'bg-amber-500'}`}
              />
            }
            onPress={() => onLocaleChange(locale.key)}
          >
            {locale.label}
          </Button>
        );
      })}
    </div>
  );
}

function TranslationFieldInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        placeholder={label}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
    </div>
  );
}

export function TranslationsSection({
  activeLocale,
  translations,
  onLocaleChange,
  onFieldChange,
}: Props) {
  const t = useT();
  const current = translations[activeLocale];

  return (
    <div className="space-y-4">
      <Label>{t('admin.sectionTypes.form.translations')}</Label>
      <LocaleTabs
        activeLocale={activeLocale}
        translations={translations}
        onLocaleChange={onLocaleChange}
      />
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <TranslationFieldInput
            label={t('admin.sectionTypes.form.title')}
            value={current.title}
            onChange={(v) => onFieldChange('title', v)}
          />
          <TranslationFieldInput
            label={t('admin.sectionTypes.form.label')}
            value={current.label}
            onChange={(v) => onFieldChange('label', v)}
          />
        </div>
        <TranslationFieldInput
          label={t('admin.sectionTypes.form.description')}
          value={current.description}
          onChange={(v) => onFieldChange('description', v)}
        />
        <div className="grid grid-cols-3 gap-4">
          <TranslationFieldInput
            label={t('admin.sectionTypes.form.noDataLabel')}
            value={current.noDataLabel}
            onChange={(v) => onFieldChange('noDataLabel', v)}
          />
          <TranslationFieldInput
            label={t('admin.sectionTypes.form.placeholder')}
            value={current.placeholder}
            onChange={(v) => onFieldChange('placeholder', v)}
          />
          <TranslationFieldInput
            label={t('admin.sectionTypes.form.addLabel')}
            value={current.addLabel}
            onChange={(v) => onFieldChange('addLabel', v)}
          />
        </div>
      </div>
    </div>
  );
}
