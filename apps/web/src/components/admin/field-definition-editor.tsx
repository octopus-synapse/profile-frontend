'use client';

/**
 * Field Definition Editor
 *
 * Manages the `definition.fields[]` array for a section type.
 * Supports add, remove, reorder, and per-field configuration.
 */

import { useT } from '@profile/i18n';
import { Button, Label } from '@/shared/components/ui';
import { FieldRow } from './field-row';
import { createEmptyField, type FieldDefinition, type FieldEntry } from './types/field-definition';

interface FieldDefinitionEditorProps {
  definition: FieldDefinition;
  onChange: (definition: FieldDefinition) => void;
}

export function FieldDefinitionEditor({ definition, onChange }: FieldDefinitionEditorProps) {
  const t = useT();
  const fields = definition.fields;

  const updateFields = (newFields: FieldEntry[]) => {
    onChange({ ...definition, fields: newFields });
  };

  const addField = () => {
    updateFields([...fields, createEmptyField()]);
  };

  const removeField = (index: number) => {
    updateFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updated: FieldEntry) => {
    const next = [...fields];
    next[index] = updated;
    updateFields(next);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...fields];
    const temp = next[index - 1]!;
    next[index - 1] = next[index]!;
    next[index] = temp;
    updateFields(next);
  };

  const moveDown = (index: number) => {
    if (index >= fields.length - 1) return;
    const next = [...fields];
    const temp = next[index]!;
    next[index] = next[index + 1]!;
    next[index + 1] = temp;
    updateFields(next);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{t('admin.sectionTypes.fields.title')}</Label>
        <span className="text-pf-fg-muted text-xs">
          {t('admin.sectionTypes.fields.count', { count: fields.length })}
        </span>
      </div>

      {fields.length === 0 && (
        <p className="text-pf-fg-muted text-center text-sm py-4">
          {t('admin.sectionTypes.fields.empty')}
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field, i) => (
          <FieldRow
            key={`field-${i}`}
            field={field}
            index={i}
            onChange={updateField}
            onRemove={removeField}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            isFirst={i === 0}
            isLast={i === fields.length - 1}
          />
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addField} className="w-full">
        {t('admin.sectionTypes.fields.add')}
      </Button>
    </div>
  );
}
