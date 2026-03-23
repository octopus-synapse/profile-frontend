interface ResumeListItem {
  id: string;
}

/**
 * Extract resume list items from API response.
 * The API response structure may vary - this function handles multiple formats.
 */
export function extractResumeListItems(response: unknown): ResumeListItem[] {
  // Try various possible response shapes
  const data = (
    response as { data?: { data?: unknown; resumes?: unknown; items?: unknown } } | null
  )?.data;

  // Shape 1: { data: { data: ResumeListItem[] } }
  if (Array.isArray(data?.data)) {
    return data.data;
  }

  // Shape 2: { data: { resumes: ResumeListItem[] } }
  if (Array.isArray(data?.resumes)) {
    return data.resumes;
  }

  // Shape 3: { data: { items: ResumeListItem[] } }
  if (Array.isArray(data?.items)) {
    return data.items;
  }

  // Shape 4: { data: ResumeListItem[] }
  if (Array.isArray(data)) {
    return data;
  }

  return [];
}
