/**
 * Education Hooks
 * React Query hooks for education management
 */

"use client";

import { createCrudHooks } from "@/shared/hooks/use-crud";
import { educationRepository } from "../services/settings-repository";
import type { Education, CreateEducationPayload } from "../types";

const educationHooks = createCrudHooks<Education, CreateEducationPayload>(
  "education",
  educationRepository
);

export const educationKeys = educationHooks.queryKeys;
export const useEducation = educationHooks.useList;
export const useEducationItem = educationHooks.useDetail;
export const useCreateEducation = educationHooks.useCreate;
export const useUpdateEducation = educationHooks.useUpdate;
export const useDeleteEducation = educationHooks.useDelete;
