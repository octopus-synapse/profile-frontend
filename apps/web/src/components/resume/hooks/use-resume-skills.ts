'use client';

import { apiFetch } from '@profile/api-client';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { resumeKeys } from './query-keys';

// ============================================================================
// Types
// ============================================================================

export interface Skill {
  id: string;
  resumeId: string;
  name: string;
  category: string;
  level?: number;
  order: number;
}

interface CreateSkillInput {
  name: string;
  category: string;
  level?: number;
}

interface UpdateSkillInput {
  skillId: string;
  name?: string;
  category?: string;
  level?: number;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const resumeSkillsKeys = {
  all: (resumeId: string) => ['resumeSkills', resumeId] as const,
  list: (resumeId: string) =>
    [...resumeSkillsKeys.all(resumeId), 'list'] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useResumeSkills(resumeId: string) {
  return useQuery({
    queryKey: resumeSkillsKeys.list(resumeId),
    queryFn: async () => {
      const result = await apiFetch.get<{ skills: Skill[] }>(
        `/api/v1/resumes/${resumeId}/skills`,
      );
      return result.skills;
    },
    staleTime: 30_000,
    enabled: !!resumeId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useAddSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSkillInput) => {
      const result = await apiFetch.post<{ skill: Skill }>(
        `/api/v1/resumes/${resumeId}/skills`,
        input,
      );
      return result.skill;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeSkillsKeys.all(resumeId),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useUpdateSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ skillId, ...data }: UpdateSkillInput) => {
      const result = await apiFetch.patch<{ skill: Skill }>(
        `/api/v1/resumes/${resumeId}/skills/${skillId}`,
        data,
      );
      return result.skill;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeSkillsKeys.all(resumeId),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}

export function useDeleteSkill(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const result = await apiFetch.delete<{ result: { deleted: boolean } }>(
        `/api/v1/resumes/${resumeId}/skills/${skillId}`,
      );
      return result.result;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: resumeSkillsKeys.all(resumeId),
      });
      void queryClient.invalidateQueries({
        queryKey: resumeKeys.detail(resumeId),
      });
    },
  });
}
