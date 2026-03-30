'use client';

/**
 * Field Styles Editor
 *
 * Configures per-field rendering styles (semantic role, widget, width).
 * Field keys are derived from the definition.fields[] array.
 * Maps to the backend FieldStylesSchema.
 */

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@octopus-synapse/profile-ui';
import { useT } from '@profile/i18n';
import type { FieldEntry } from '../../types/field-definition';
import {
  FIELD_SEMANTICS,
  FIELD_WIDGETS,
  FIELD_WIDTHS,
  type FieldSemantic,
  type FieldStyleEntry,
  type FieldStylesMap,
  type FieldWidget,
  type FieldWidth,
} from '../../types/style-config';

interface FieldStylesEditorProps {
  fields: FieldEntry[];
  fieldStyles: FieldStylesMap;
  onChange: (styles: FieldStylesMap) => void;
}

export function FieldStylesEditor({ fields, fieldStyles, onChange }: FieldStylesEditorProps) {
  const t = useT();
  const updateFieldStyle = (key: string, patch: Partial<FieldStyleEntry>) => {
    const current = fieldStyles[key] ?? {};
    const updated = { ...current, ...patch };
    // Remove undefined values
    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([_, v]) => v != null),
    ) as FieldStyleEntry;
    onChange({ ...fieldStyles, [key]: cleaned });
  };

  if (fields.length === 0) {
    return (
      <div className="space-y-3">
        <Label className="text-sm font-semibold">{t('admin.sectionTypes.fieldStyles.title')}</Label>
        <p className="text-pf-fg-muted text-center text-sm py-2">
          {t('admin.sectionTypes.fieldStyles.empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{t('admin.sectionTypes.fieldStyles.title')}</Label>

      <div className="border-pf-border-default rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-pf-canvas-subtle text-pf-fg-muted text-xs">
              <th className="px-3 py-2 text-left font-medium">
                {t('admin.sectionTypes.fieldStyles.field')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('admin.sectionTypes.fieldStyles.semantic')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('admin.sectionTypes.fieldStyles.widget')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('admin.sectionTypes.fieldStyles.width')}
              </th>
            </tr>
          </thead>
          <tbody>
            {fields
              .filter((f) => f.key.trim())
              .map((field) => {
                const style = fieldStyles[field.key] ?? {};
                return (
                  <tr key={field.key} className="border-pf-border-default border-t">
                    <td className="px-3 py-2">
                      <code className="text-xs bg-pf-canvas-subtle px-1.5 py-0.5 rounded">
                        {field.key}
                      </code>
                    </td>
                    <td className="px-3 py-1.5">
                      <Select
                        value={style.semantic ?? ''}
                        onValueChange={(v) =>
                          updateFieldStyle(field.key, {
                            semantic: (v || undefined) as FieldSemantic,
                          })
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">
                            {t('admin.sectionTypes.fieldStyles.none')}
                          </SelectItem>
                          {FIELD_SEMANTICS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-1.5">
                      <Select
                        value={style.widget ?? ''}
                        onValueChange={(v) =>
                          updateFieldStyle(field.key, { widget: (v || undefined) as FieldWidget })
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">
                            {t('admin.sectionTypes.fieldStyles.default')}
                          </SelectItem>
                          {FIELD_WIDGETS.map((w) => (
                            <SelectItem key={w} value={w}>
                              {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-1.5">
                      <Select
                        value={style.width ?? ''}
                        onValueChange={(v) =>
                          updateFieldStyle(field.key, { width: (v || undefined) as FieldWidth })
                        }
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue placeholder="—" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">
                            {t('admin.sectionTypes.fieldStyles.auto')}
                          </SelectItem>
                          {FIELD_WIDTHS.map((w) => (
                            <SelectItem key={w} value={w}>
                              {w}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
