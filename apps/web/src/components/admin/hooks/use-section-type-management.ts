'use client';

/**
 * Section Type Management Hooks
 *
 * Real implementations using customFetch against the admin section types API.
 * Follows the same TanStack Query patterns as the rest of the admin module.
 */

import { customFetch } from '@profile/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  CreateSectionTypePayload,
  SectionTypeData,
  SectionTypeListParams,
  SectionTypeListResponse,
  UpdateSectionTypePayload,
} from '../types/section-types';
import { adminKeys } from './query-keys';

const BASE_URL = '/api/v1/admin/section-types';

/**
 * List section types with pagination and filtering
 */
export function useSectionTypesList(params: SectionTypeListParams = {}) {
  return useQuery({
    queryKey: adminKeys.sectionTypes.list(params as Record<string, unknown>),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
      if (params.search) searchParams.set('search', params.search);
      if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
      if (params.semanticKind) searchParams.set('semanticKind', params.semanticKind);

      const qs = searchParams.toString();
      const url = qs ? `${BASE_URL}?${qs}` : BASE_URL;

      const response = await customFetch<{ data: SectionTypeListResponse }>(url);
      return response.data;
    },
    staleTime: 30_000,
  });
}

/**
 * Get a single section type by key
 */
export function useSectionTypeDetail(key: string | null) {
  return useQuery({
    queryKey: adminKeys.sectionTypes.detail(key ?? ''),
    queryFn: async () => {
      const response = await customFetch<{ data: SectionTypeData }>(`${BASE_URL}/${key}`);
      return response.data;
    },
    enabled: !!key,
  });
}

/**
 * Get all unique semantic kinds (for filter dropdown)
 */
export function useSemanticKinds() {
  return useQuery({
    queryKey: adminKeys.sectionTypes.semanticKinds(),
    queryFn: async () => {
      const response = await customFetch<{ data: string[] }>(`${BASE_URL}/semantic-kinds`);
      return response.data;
    },
    staleTime: 60_000,
  });
}

/**
 * Create a new section type
 */
export function useSectionTypeCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSectionTypePayload) => {
      const response = await customFetch<{ data: SectionTypeData }>(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.sectionTypes.all() });
    },
  });
}

/**
 * Update an existing section type
 */
export function useSectionTypeUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ key, payload }: { key: string; payload: UpdateSectionTypePayload }) => {
      const response = await customFetch<{ data: SectionTypeData }>(`${BASE_URL}/${key}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.sectionTypes.all() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.sectionTypes.detail(variables.key),
      });
    },
  });
}

/**
 * Delete a section type
 */
export function useSectionTypeDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      await customFetch(`${BASE_URL}/${key}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.sectionTypes.all() });
    },
  });
}
