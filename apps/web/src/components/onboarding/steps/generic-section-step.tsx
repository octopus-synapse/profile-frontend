/**
 * Generic Section Step
 *
 * Renders any section type dynamically from backend field definitions.
 * StepMetaDto.fields drives the form — zero hardcoded section config.
 */

'use client';

import type { StepFieldDto } from '@profile/api-client';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import {
  getSectionTypeFromStep,
  type SectionItem,
  type SectionStep,
  useOnboarding,
} from '../hooks';
import { StepNavigation } from '../step-navigation';

interface GenericSectionStepProps {
  stepId: SectionStep;
}

export function GenericSectionStep({ stepId }: GenericSectionStepProps) {
  const { getSection, goToNextStep, isSaving, currentStepMeta } = useOnboarding();

  const sectionTypeKey = getSectionTypeFromStep(stepId);
  const sectionData = getSection(sectionTypeKey);

  // All display metadata comes from the backend session
  const fields: StepFieldDto[] = currentStepMeta?.fields ?? [];
  const icon = currentStepMeta?.icon ?? '📄';
  const placeholder = currentStepMeta?.placeholder ?? 'Add items...';
  const addLabel = currentStepMeta?.addLabel ?? 'Add Item';
  const noDataLabel =
    currentStepMeta?.noDataLabel ??
    `I don't have ${currentStepMeta?.label?.toLowerCase() ?? 'items'} to add`;

  // Local editing state (mirrors server state)
  const [items, setItems] = useState<SectionItem[]>(sectionData?.items ?? []);
  const [noData, setNoData] = useState(sectionData?.noData ?? false);
  const [newItemData, setNewItemData] = useState<Record<string, unknown>>({});

  const handleAddItem = useCallback(() => {
    const newItem: SectionItem = { id: nanoid(), content: { ...newItemData } };
    setItems((prev) => [...prev, newItem]);
    setNewItemData({});
    setNoData(false);
  }, [newItemData]);

  const handleRemoveItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleUpdateItemField = useCallback((itemId: string, key: string, value: unknown) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, content: { ...item.content, [key]: value } } : item,
      ),
    );
  }, []);

  const handleToggleNoData = useCallback(() => {
    setNoData((prev) => {
      const newValue = !prev;
      if (newValue) setItems([]);
      return newValue;
    });
  }, []);

  const canProceed = noData || items.length > 0;

  const handleNext = useCallback(async () => {
    await goToNextStep({
      sections: [{ sectionTypeKey, items, noData }],
    });
  }, [sectionTypeKey, items, noData, goToNextStep]);

  const isNewItemValid = fields
    .filter((f) => f.required)
    .every((f) => newItemData[f.key] && String(newItemData[f.key]).trim() !== '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h2 className="font-mono text-lg font-bold text-white">
            {currentStepMeta?.label ?? sectionTypeKey}
          </h2>
        </div>
        <p className="font-mono text-sm text-zinc-400">{placeholder}</p>
      </div>

      {/* No Data Option */}
      <div className="border-white/10 rounded border p-4">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={noData}
            onChange={handleToggleNoData}
            className="bg-zinc-900 border-zinc-700 h-4 w-4 rounded"
          />
          <span className="text-sm text-zinc-300">{noDataLabel}</span>
        </label>
      </div>

      {/* Items List */}
      {!noData && (
        <>
          {items.length > 0 && (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border-white/10 bg-zinc-900/50 group relative rounded border p-4"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id!)}
                    className="hover:bg-red-500/20 hover:text-red-400 absolute right-2 top-2 rounded p-1 text-zinc-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid gap-3 pr-8">
                    {fields.map((field) => (
                      <FieldInput
                        key={field.key}
                        field={field}
                        value={item.content[field.key]}
                        onChange={(v) => handleUpdateItemField(item.id!, field.key, v)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Item Form */}
          <div className="border-cyan-500/30 bg-cyan-500/5 rounded border border-dashed p-4">
            <p className="mb-3 font-mono text-sm text-cyan-400">{addLabel}</p>
            <div className="grid gap-3">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={newItemData[field.key]}
                  onChange={(v) => setNewItemData((prev) => ({ ...prev, [field.key]: v }))}
                  showPlaceholder
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              disabled={!isNewItemValid}
              className="mt-3 flex items-center gap-2 rounded bg-cyan-500/20 px-4 py-2 font-mono text-sm text-cyan-400 transition-colors hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {addLabel}
            </button>
          </div>
        </>
      )}

      {/* Empty state */}
      {!noData && items.length === 0 && (
        <p className="py-4 text-center font-mono text-sm text-zinc-500">No items added yet</p>
      )}

      {/* Item count */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-mono text-sm">
            {items.length} {items.length === 1 ? 'item' : 'items'} added
          </span>
        </div>
      )}

      <StepNavigation
        onNext={handleNext}
        canProceed={canProceed}
        isLoading={isSaving}
        nextLabel="Continue"
      />
    </div>
  );
}

// --- Field renderer driven by StepFieldDto ---

function FieldInput({
  field,
  value,
  onChange,
  showPlaceholder = false,
}: {
  field: StepFieldDto;
  value: unknown;
  onChange: (v: string) => void;
  showPlaceholder?: boolean;
}) {
  const strVal = String(value ?? '');
  const inputType = field.widget === 'textarea' ? 'textarea' : field.type;
  const placeholder = showPlaceholder ? `Enter ${field.label.toLowerCase()}...` : undefined;

  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-zinc-500">
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
      </label>
      {inputType === 'textarea' ? (
        <textarea
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-white/10 bg-zinc-900 w-full rounded border px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
          rows={3}
        />
      ) : field.options && field.options.length > 0 ? (
        <select
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          className="border-white/10 bg-zinc-900 w-full rounded border px-3 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type === 'date' ? 'date' : 'text'}
          value={strVal}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="border-white/10 bg-zinc-900 w-full rounded border px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
        />
      )}
    </div>
  );
}
