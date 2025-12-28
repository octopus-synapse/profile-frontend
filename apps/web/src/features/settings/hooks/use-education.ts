/**
 * Education Hooks
 * React Query hooks for education management
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { educationRepository } from "../services/settings-repository";
import type { CreateEducationPayload } from "../types";

export const educationKeys = {
  all: ["education"] as const,
  list: () => [...educationKeys.all, "list"] as const,
  detail: (id: string) => [...educationKeys.all, "detail", id] as const,
};

export function useEducation() {
  return useQuery({
    queryKey: educationKeys.list(),
    queryFn: () => educationRepository.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEducationItem(id: string) {
  return useQuery({
    queryKey: educationKeys.detail(id),
    queryFn: () => educationRepository.getOne(id),
    enabled: !!id,
  });
}

export function useCreateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEducationPayload) => educationRepository.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEducationPayload> }) =>
      educationRepository.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => educationRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: educationKeys.all });
    },
  });
}
