/**
 * Experiences Hooks
 * React Query hooks for work experience management
 */

"use client";

import { createCrudHooks } from "@/shared/hooks/use-crud";
import { experiencesRepository } from "../services/settings-repository";
import type { Experience, CreateExperiencePayload } from "../types";

const experiencesHooks = createCrudHooks<Experience, CreateExperiencePayload>(
  "experiences",
  experiencesRepository
);

export const experiencesKeys = experiencesHooks.queryKeys;
export const useExperiences = experiencesHooks.useList;
export const useExperience = experiencesHooks.useDetail;
export const useCreateExperience = experiencesHooks.useCreate;
export const useUpdateExperience = experiencesHooks.useUpdate;
export const useDeleteExperience = experiencesHooks.useDelete;
