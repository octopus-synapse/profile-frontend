/**
 * Skills Hooks
 * React Query hooks for skills management
 */

"use client";

import { createCrudHooks } from "@/shared/hooks/use-crud";
import { skillsRepository } from "../services/settings-repository";
import type { Skill, CreateSkillPayload } from "../types";

const skillsHooks = createCrudHooks<Skill, CreateSkillPayload>(
  "skills",
  skillsRepository
);

export const skillsKeys = skillsHooks.queryKeys;
export const useSkills = skillsHooks.useList;
export const useSkill = skillsHooks.useDetail;
export const useCreateSkill = skillsHooks.useCreate;
export const useUpdateSkill = skillsHooks.useUpdate;
export const useDeleteSkill = skillsHooks.useDelete;
