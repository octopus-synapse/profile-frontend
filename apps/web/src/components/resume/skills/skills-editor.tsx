'use client';

import { Loader2, Pencil, Plus, Sparkles, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Badge, Button, Input, Skeleton } from '@/shared/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { showToast } from '@/shared/components/ui/toast';
import { TechSkillAutocomplete } from '@/components/tech-skills/components/tech-skill-autocomplete';
import { useI18n } from '@profile/i18n';
import { useAddSkill, useDeleteSkill, useResumeSkills, useUpdateSkill } from '../hooks/use-resume-skills';

interface Skill {
  id: string;
  resumeId: string;
  name: string;
  category: string;
  level?: number;
  order: number;
}

export interface SkillsEditorProps {
  resumeId: string;
}

const CATEGORIES = [
  'Frontend', 'Backend', 'DevOps', 'Database', 'Language', 'Tool', 'Soft Skill',
] as const;

type Category = (typeof CATEGORIES)[number];

interface SkillDraft { name: string; category: Category; level?: number }

const EMPTY_DRAFT: SkillDraft = { name: '', category: 'Frontend', level: undefined };

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-5 w-32" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={`skel-${i}`} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

function EmptyState() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 py-8 text-center">
      <Sparkles className="h-6 w-6 text-zinc-500" />
      <p className="text-sm text-zinc-400">{t('resume.skills.noSkills')}</p>
    </div>
  );
}

interface SkillBadgeProps {
  skill: Skill;
  isDeleting: boolean;
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
}

function SkillBadge({ skill, isDeleting, onEdit, onDelete }: SkillBadgeProps) {
  const { t } = useI18n();
  const translatedCategory = t(`resume.skills.category.${skill.category.replace(/\s/g, '')}` as any);
  const levelLabel = skill.level ? ` · ${skill.level}` : '';
  return (
    <Badge variant="secondary" className="group cursor-pointer gap-1 pr-1 text-sm transition-colors hover:bg-white/10">
      <button type="button" className="flex items-center gap-1" onClick={() => onEdit(skill)}>
        <span>{skill.name}</span>
        <span className="text-zinc-500">{translatedCategory}{levelLabel}</span>
        <Pencil className="ml-0.5 hidden h-3 w-3 text-zinc-500 group-hover:inline-block" />
      </button>
      <button
        type="button"
        aria-label={t('resume.skills.removeLabel', { name: skill.name })}
        disabled={isDeleting}
        className="ml-1 rounded-full p-0.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-red-400 disabled:opacity-40"
        onClick={(e) => { e.stopPropagation(); onDelete(skill.id); }}
      >
        {isDeleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </button>
    </Badge>
  );
}

export function SkillsEditor({ resumeId }: SkillsEditorProps) {
  const { t } = useI18n();
  const { data, isLoading } = useResumeSkills(resumeId);
  const addSkill = useAddSkill(resumeId);
  const updateSkill = useUpdateSkill(resumeId);
  const deleteSkill = useDeleteSkill(resumeId);

  const [draft, setDraft] = useState<SkillDraft>({ ...EMPTY_DRAFT });
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const skills: Skill[] = data ?? [];
  const existingNames = skills.map((s) => s.name.toLowerCase());

  const resetDraft = useCallback(() => {
    setDraft({ ...EMPTY_DRAFT });
    setEditingSkill(null);
  }, []);

  const handleCatalogSelect = useCallback(
    (_slug: string | null, meta?: { name: string; category: string }) => {
      if (!meta) return;
      const matchedCategory = CATEGORIES.includes(meta.category as Category) ? meta.category : undefined;
      setDraft((prev) => ({ ...prev, name: meta.name, category: (matchedCategory ?? prev.category) as Category }));
    },
    [],
  );

  const handleAdd = useCallback(async () => {
    const name = draft.name.trim();
    if (!name) return;
    if (existingNames.includes(name.toLowerCase())) {
      showToast.warning(t('resume.skills.duplicateTitle'), t('resume.skills.duplicateDesc', { name }));
      return;
    }
    try {
      await addSkill.mutateAsync({ name, category: draft.category, level: draft.level });
      showToast.success(t('resume.skills.addedTitle'), t('resume.skills.addedDesc', { name }));
      resetDraft();
    } catch {
      showToast.error(t('resume.skills.failedAdd'), t('resume.skills.tryAgain'));
    }
  }, [draft, existingNames, addSkill, resetDraft]);

  const handleUpdate = useCallback(async () => {
    if (!editingSkill) return;
    const name = draft.name.trim();
    if (!name) return;
    try {
      await updateSkill.mutateAsync({ skillId: editingSkill.id, name, category: draft.category, level: draft.level });
      showToast.success(t('resume.skills.updatedTitle'), t('resume.skills.updatedDesc', { name }));
      resetDraft();
    } catch {
      showToast.error(t('resume.skills.failedUpdate'), t('resume.skills.tryAgain'));
    }
  }, [draft, editingSkill, updateSkill, resetDraft]);

  const handleDelete = useCallback(async (skillId: string) => {
    setDeletingId(skillId);
    try {
      await deleteSkill.mutateAsync(skillId);
      showToast.success(t('resume.skills.removed'));
    } catch {
      showToast.error(t('resume.skills.failedRemove'));
    } finally {
      setDeletingId(null);
    }
  }, [deleteSkill]);

  const handleEdit = useCallback((skill: Skill) => {
    setEditingSkill(skill);
    const cat = CATEGORIES.includes(skill.category as Category) ? skill.category : 'Frontend';
    setDraft({ name: skill.name, category: cat as Category, level: skill.level });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); editingSkill ? handleUpdate() : handleAdd(); }
    if (e.key === 'Escape') resetDraft();
  }, [editingSkill, handleAdd, handleUpdate, resetDraft]);

  if (isLoading) return <LoadingSkeleton />;

  const isMutating = addSkill.isPending || updateSkill.isPending;
  const isEditing = editingSkill !== null;
  const canSubmit = draft.name.trim().length > 0 && !isMutating;

  return (
    <section className="space-y-4" aria-label={t('resume.skills.editorLabel')}>
      {/* Skill tags */}
      {skills.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <SkillBadge
              key={skill.id}
              skill={skill}
              isDeleting={deletingId === skill.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit form */}
      <div
        className="flex flex-col gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-3 sm:flex-row sm:items-end"
        onKeyDown={handleKeyDown}
        role="form"
        aria-label={isEditing ? t('resume.skills.editSkill') : t('resume.skills.addSkill')}
      >
        <div className="min-w-0 flex-1">
          <TechSkillAutocomplete
            value={null}
            displayValue={draft.name}
            onValueChange={handleCatalogSelect}
            placeholder={t('resume.skills.namePlaceholder')}
            className="w-full"
          />
        </div>

        <Select value={draft.category} onValueChange={(v) => setDraft((d) => ({ ...d, category: v as Category }))}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder={t('resume.skills.categoryPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {t(`resume.skills.category.${cat.replace(/\s/g, '')}` as any)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          inputMode="numeric"
          min={1}
          max={10}
          placeholder={t('resume.skills.levelPlaceholder')}
          value={draft.level ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value === '' ? undefined : Number(e.target.value);
            setDraft((d) => ({ ...d, level: v }));
          }}
          className="w-full sm:w-20"
        />

        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={!canSubmit}
            loading={isMutating}
            onClick={isEditing ? handleUpdate : handleAdd}
            leftIcon={isEditing ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          >
            {isEditing ? t('action.save') : t('resume.skills.add')}
          </Button>

          {isEditing && (
            <Button size="sm" variant="ghost" onClick={resetDraft}>
              {t('action.cancel')}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

SkillsEditor.displayName = 'SkillsEditor';
