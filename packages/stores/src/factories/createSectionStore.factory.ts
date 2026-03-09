/**
 * Generic factory for creating CRUD store actions for advanced sections
 * This eliminates 875+ lines of duplicated code by providing a reusable pattern
 * for all section types (awards, publications, talks, etc.)
 */

/**
 * API client interface for a single section type
 * Each section must provide these CRUD operations
 */
export interface SectionApiClient<T, CreateDto, UpdateDto> {
 list(resumeId: string): Promise<T[]>;
 create(resumeId: string, data: CreateDto): Promise<T>;
 update(resumeId: string, id: string, data: UpdateDto): Promise<T>;
 delete(resumeId: string, id: string): Promise<void>;
 reorder(resumeId: string, order: string[]): Promise<T[]>;
}

/**
 * Configuration for creating section-specific store actions
 */
export interface SectionStoreConfig<T, CreateDto, UpdateDto> {
 /** Name of the section (e.g., 'awards', 'publications') */
 sectionName: string;
 /** API client for this section */
 apiClient: SectionApiClient<T, CreateDto, UpdateDto>;
}

/**
 * Store state interface that all sections must implement
 */
export interface SectionState {
 isLoading: boolean;
 error: string | null;
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 [key: string]: any; // Allow dynamic section properties
}

/**
 * Generic CRUD actions for a section
 */
export interface SectionActions<T, CreateDto, UpdateDto> {
 fetch(resumeId: string): Promise<void>;
 add(resumeId: string, data: CreateDto): Promise<T>;
 update(resumeId: string, id: string, data: UpdateDto): Promise<T>;
 delete(resumeId: string, id: string): Promise<void>;
 reorder(resumeId: string, order: string[]): Promise<void>;
}

// Simple SetState type for Zustand
type SetState<S> = (partial: Partial<S> | ((state: S) => Partial<S>)) => void;

/**
 * Creates generic CRUD actions for a specific section type
 * This factory eliminates code duplication by providing a reusable implementation
 *
 * @example
 * ```typescript
 * const awardsActions = createSectionActions({
 *   sectionName: 'awards',
 *   apiClient: apiClient.advancedSections.awards
 * });
 * ```
 */
export function createSectionActions<
 T extends { id: string },
 CreateDto,
 UpdateDto,
>(config: SectionStoreConfig<T, CreateDto, UpdateDto>) {
 const { sectionName, apiClient } = config;

 return {
  /**
   * Fetches all items for this section
   */
  fetch:
   (set: SetState<SectionState>) =>
   async (resumeId: string): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
     const items = await apiClient.list(resumeId);
     set({
      [sectionName]: items,
      isLoading: false,
     });
    } catch (error) {
     const message =
      error instanceof Error ? error.message : `Failed to fetch ${sectionName}`;
     set({ error: message, isLoading: false });
    }
   },

  /**
   * Adds a new item to this section
   */
  add:
   (set: SetState<SectionState>) =>
   async (resumeId: string, data: CreateDto): Promise<T> => {
    set({ isLoading: true, error: null });
    try {
     const item = await apiClient.create(resumeId, data);
     set((state) => ({
      [sectionName]: [...(state[sectionName] || []), item],
      isLoading: false,
     }));
     return item;
    } catch (error) {
     const message =
      error instanceof Error ? error.message : `Failed to add ${sectionName}`;
     set({ error: message, isLoading: false });
     throw error;
    }
   },

  /**
   * Updates an existing item in this section
   */
  update:
   (set: SetState<SectionState>) =>
   async (resumeId: string, id: string, data: UpdateDto): Promise<T> => {
    set({ isLoading: true, error: null });
    try {
     const updated = await apiClient.update(resumeId, id, data);
     set((state) => ({
      [sectionName]: (state[sectionName] || []).map((item: T) =>
       item.id === id ? updated : item,
      ),
      isLoading: false,
     }));
     return updated;
    } catch (error) {
     const message =
      error instanceof Error
       ? error.message
       : `Failed to update ${sectionName}`;
     set({ error: message, isLoading: false });
     throw error;
    }
   },

  /**
   * Deletes an item from this section
   */
  delete:
   (set: SetState<SectionState>) =>
   async (resumeId: string, id: string): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
     await apiClient.delete(resumeId, id);
     set((state) => ({
      [sectionName]: (state[sectionName] || []).filter(
       (item: T) => item.id !== id,
      ),
      isLoading: false,
     }));
    } catch (error) {
     const message =
      error instanceof Error
       ? error.message
       : `Failed to delete ${sectionName}`;
     set({ error: message, isLoading: false });
    }
   },

  /**
   * Reorders items in this section
   */
  reorder:
   (set: SetState<SectionState>) =>
   async (resumeId: string, order: string[]): Promise<void> => {
    set({ isLoading: true, error: null });
    try {
     const reordered = await apiClient.reorder(resumeId, order);
     set({
      [sectionName]: reordered,
      isLoading: false,
     });
    } catch (error) {
     const message =
      error instanceof Error
       ? error.message
       : `Failed to reorder ${sectionName}`;
     set({ error: message, isLoading: false });
    }
   },
 };
}
