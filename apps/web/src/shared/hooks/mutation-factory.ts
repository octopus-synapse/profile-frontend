'use client';

import {
  type QueryKey,
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

interface CreateMutationHookOptions<TInput, TOutput> {
  mutationFn: (input: TInput) => Promise<TOutput>;
  invalidateKeys?: QueryKey[];
  onSuccessMessage?: string;
}

export function createMutationHook<TInput, TOutput>(
  options: CreateMutationHookOptions<TInput, TOutput>,
) {
  return function useMutationHook(overrides?: Partial<UseMutationOptions<TOutput, Error, TInput>>) {
    const queryClient = useQueryClient();

    return useMutation<TOutput, Error, TInput>({
      mutationFn: options.mutationFn,
      onSuccess: (...args) => {
        if (options.invalidateKeys) {
          for (const key of options.invalidateKeys) {
            void queryClient.invalidateQueries({ queryKey: key });
          }
        }
        overrides?.onSuccess?.(...args);
      },
      ...overrides,
    });
  };
}
