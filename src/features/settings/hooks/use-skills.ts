/**
 * Skills Hooks
 * React Query hooks for skills management
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsRepository } from "../services/settings-repository";
import type { CreateSkillPayload } from "../types";

export const skillsKeys = {
  all: ["skills"] as const,
  list: () => [...skillsKeys.all, "list"] as const,
  detail: (id: string) => [...skillsKeys.all, "detail", id] as const,
};

export function useSkills() {
  return useQuery({
    queryKey: skillsKeys.list(),
    queryFn: () => skillsRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: skillsKeys.detail(id),
    queryFn: () => skillsRepository.getOne(id),
    enabled: !!id,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillPayload) => skillsRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.all });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSkillPayload> }) =>
      skillsRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.all });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => skillsRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillsKeys.all });
    },
  });
}
