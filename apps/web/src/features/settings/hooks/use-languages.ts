/**
 * Languages Hooks
 * React Query hooks for languages management
 */

"use client";

import { createCrudHooks } from "@/shared/hooks/use-crud";
import { languagesRepository } from "../services/settings-repository";
import type { Language, CreateLanguagePayload } from "../types";

const languagesHooks = createCrudHooks<Language, CreateLanguagePayload>(
  "languages",
  languagesRepository
);

export const languagesKeys = languagesHooks.queryKeys;
export const useLanguages = languagesHooks.useList;
export const useLanguage = languagesHooks.useDetail;
export const useCreateLanguage = languagesHooks.useCreate;
export const useUpdateLanguage = languagesHooks.useUpdate;
export const useDeleteLanguage = languagesHooks.useDelete;
