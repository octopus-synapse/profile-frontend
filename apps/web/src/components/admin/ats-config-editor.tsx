'use client';

/**
 * ATS Config Editor
 *
 * Configures the ATS (Applicant Tracking System) validation block
 * within the section type definition.
 */

import { useT } from '@profile/i18n';
import { Input, Label } from '@/shared/components/ui';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { createEmptyAtsConfig, type AtsConfig, type FieldEntry } from './types/field-definition';

interface AtsConfigEditorProps {
  atsConfig?: AtsConfig;
  fields: FieldEntry[];
  onChange: (config: AtsConfig) => void;
}

export function AtsConfigEditor({ atsConfig, fields, onChange }: AtsConfigEditorProps) {
  const t = useT();
  const config = atsConfig ?? createEmptyAtsConfig();
  const update = (patch: Partial<AtsConfig>) => onChange({ ...config, ...patch });

  const updateScoring = (patch: Partial<AtsConfig['scoring']>) =>
    update({ scoring: { ...config.scoring, ...patch } });

  const updateDetection = (patch: Partial<AtsConfig['sectionDetection']>) =>
    update({ sectionDetection: { ...config.sectionDetection, ...patch } });

  const updateFieldWeight = (semanticRole: string, weight: number) => {
    const next = { ...config.scoring.fieldWeights };
    if (weight > 0) {
      next[semanticRole] = weight;
    } else {
      delete next[semanticRole];
    }
    updateScoring({ fieldWeights: next });
  };

  const fieldRoles = fields
    .filter((f) => f.key.trim() && f.semanticRole)
    .map((f) => f.semanticRole);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-semibold">{t('admin.sectionTypes.ats.title')}</Label>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-1.5 pt-5">
          <Checkbox
            id="ats-mandatory"
            checked={config.isMandatory}
            onCheckedChange={(v) => update({ isMandatory: v === true })}
          />
          <Label htmlFor="ats-mandatory" className="text-xs">{t('admin.sectionTypes.ats.mandatory')}</Label>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.ats.position')}</Label>
          <Input
            type="number"
            min={1}
            max={20}
            value={config.recommendedPosition}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => update({ recommendedPosition: Number(e.target.value) || 1 })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.ats.baseScore')}</Label>
          <Input
            type="number"
            min={0}
            max={100}
            value={config.scoring.baseScore}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateScoring({ baseScore: Number(e.target.value) || 0 })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.ats.keywords')}</Label>
          <Input
            placeholder={t('admin.sectionTypes.ats.keywordsPlaceholder')}
            value={config.sectionDetection.keywords.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDetection({ keywords: parseCommaSeparated(e.target.value) })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t('admin.sectionTypes.ats.multiWord')}</Label>
          <Input
            placeholder={t('admin.sectionTypes.ats.multiWordPlaceholder')}
            value={config.sectionDetection.multiWord.join(', ')}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDetection({ multiWord: parseCommaSeparated(e.target.value) })}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {fieldRoles.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs">{t('admin.sectionTypes.ats.fieldWeights')}</Label>
          <div className="grid grid-cols-3 gap-2">
            {fieldRoles.map((role) => (
              <div key={role} className="flex items-center gap-2">
                <code className="text-xs bg-pf-canvas-subtle px-1.5 py-0.5 rounded truncate flex-1">{role}</code>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={config.scoring.fieldWeights[role] ?? 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFieldWeight(role, Number(e.target.value) || 0)}
                  className="h-7 w-16 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function parseCommaSeparated(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}
