/**
 * Experiences Hooks
 * React Query hooks for work experience management
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experiencesRepository } from "../services/settings-repository";
import type { CreateExperiencePayload } from "./types";

export const experiencesKeys = {
  all: ["experiences"] as const,
  list: () => [...experiencesKeys.all, "list"] as const,
  detail: (id: string) => [...experiencesKeys.all, "detail", id] as const,
};

export function useExperiences() {
  return useQuery({
    queryKey: experiencesKeys.list(),
    queryFn: () => experiencesRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useExperience(id: string) {
  return useQuery({
    queryKey: experiencesKeys.detail(id),
    queryFn: () => experiencesRepository.getOne(id),
    enabled: !!id,
  });
}

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExperiencePayload) => experiencesRepository.create(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: experiencesKeys.all });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExperiencePayload> }) =>
      experiencesRepository.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: experiencesKeys.all });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => experiencesRepository.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: experiencesKeys.all });
    },
  });
}
