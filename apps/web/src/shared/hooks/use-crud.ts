/**
 * Generic CRUD Hooks Factory
 * Creates reusable React Query hooks for CRUD operations
 */

"use client";

import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from "@tanstack/react-query";

/**
 * Generic CRUD repository interface
 */
export interface CrudRepository<TData, TCreatePayload, TUpdatePayload = Partial<TCreatePayload>> {
  getAll: () => Promise<{ data: TData[] }>;
  getOne: (id: string) => Promise<TData>;
  create: (data: TCreatePayload) => Promise<TData>;
  update: (id: string, data: TUpdatePayload) => Promise<TData>;
  delete: (id: string) => Promise<void>;
}

/**
 * Creates query keys for a resource
 */
export function createQueryKeys(resourceName: string) {
  return {
    all: [resourceName] as const,
    list: () => [resourceName, "list"] as const,
    detail: (id: string) => [resourceName, "detail", id] as const,
  };
}

/**
 * Creates CRUD hooks for a resource
 *
 * @param resourceName - Name of the resource (e.g., "education", "skills")
 * @param repository - Repository with CRUD methods
 * @returns Object with CRUD hooks
 *
 * @example
 * ```ts
 * const educationHooks = createCrudHooks("education", educationRepository);
 * const { data, isLoading } = educationHooks.useList();
 * const createMutation = educationHooks.useCreate();
 * ```
 */
export function createCrudHooks<
  TData extends { id: string },
  TCreatePayload,
  TUpdatePayload = Partial<TCreatePayload>
>(
  resourceName: string,
  repository: CrudRepository<TData, TCreatePayload, TUpdatePayload>
) {
  const queryKeys = createQueryKeys(resourceName);

  return {
    /**
     * Query keys for cache management
     */
    queryKeys,

    /**
     * Hook to fetch list of items
     */
    useList: (options?: Omit<UseQueryOptions<{ data: TData[] }>, "queryKey" | "queryFn">) => {
      return useQuery({
        queryKey: queryKeys.list(),
        queryFn: () => repository.getAll(),
        staleTime: 5 * 60 * 1000,
        ...options,
      });
    },

    /**
     * Hook to fetch a single item by ID
     */
    useDetail: (id: string, options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">) => {
      return useQuery({
        queryKey: queryKeys.detail(id),
        queryFn: () => repository.getOne(id),
        enabled: !!id,
        ...options,
      });
    },

    /**
     * Hook to create a new item
     */
    useCreate: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (data: TCreatePayload) => repository.create(data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.all });
        },
      });
    },

    /**
     * Hook to update an existing item
     */
    useUpdate: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: ({ id, data }: { id: string; data: TUpdatePayload }) =>
          repository.update(id, data),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.all });
        },
      });
    },

    /**
     * Hook to delete an item
     */
    useDelete: () => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: (id: string) => repository.delete(id),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.all });
        },
      });
    },
  };
}
