'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import type { FieldDefinition } from './field-input-shared';
import { GenericFieldInput } from './generic-field-input';

type FormValues = Record<string, unknown>;
type FormErrors = Record<string, string | undefined>;

interface SectionItemFormProps {
  fields: FieldDefinition[];
  values: FormValues;
  errors: FormErrors;
  onChange: (key: string, value: unknown) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
  isNew: boolean;
}

export function SectionItemForm({
  fields,
  values,
  errors,
  onChange,
  onSave,
  onCancel,
  isSaving,
  isNew,
}: SectionItemFormProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
      {fields.map((field) => (
        <GenericFieldInput
          key={field.key}
          field={field}
          value={values[field.key]}
          onChange={(value) => onChange(field.key, value)}
          error={errors[field.key]}
          disabled={isSaving}
        />
      ))}
      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          tone="neutral"
          size="sm"
          disabled={isSaving}
          onPress={onCancel}
        >
          {t('action.cancel')}
        </Button>
        <Button
          type="button"
          variant="solid"
          tone="neutral"
          size="sm"
          loading={isSaving}
          onPress={() => void onSave()}
        >
          {isNew ? 'Add' : 'Update'}
        </Button>
      </div>
    </div>
  );
}
