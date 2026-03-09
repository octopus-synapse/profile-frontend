/**
 * Languages Hooks
 * React Query hooks for languages management
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { languagesRepository } from "../services/settings-repository";
import type { CreateLanguagePayload } from "./types";

export const languagesKeys = {
  all: ["languages"] as const,
  list: () => [...languagesKeys.all, "list"] as const,
  detail: (id: string) => [...languagesKeys.all, "detail", id] as const,
};

export function useLanguages() {
  return useQuery({
    queryKey: languagesKeys.list(),
    queryFn: () => languagesRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useLanguage(id: string) {
  return useQuery({
    queryKey: languagesKeys.detail(id),
    queryFn: () => languagesRepository.getOne(id),
    enabled: !!id,
  });
}

export function useCreateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLanguagePayload) => languagesRepository.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: languagesKeys.all });
    },
  });
}

export function useUpdateLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateLanguagePayload> }) =>
      languagesRepository.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: languagesKeys.all });
    },
  });
}

export function useDeleteLanguage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => languagesRepository.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: languagesKeys.all });
    },
  });
}
