interface ResumeListItem {
  id: string;
}

/**
 * Extract resume list items from API response.
 * The API response structure may vary - this function handles multiple formats.
 */
export function extractResumeListItems(response: unknown): ResumeListItem[] {
  const data = (
    response as { data?: { data?: unknown; resumes?: unknown; items?: unknown } } | null
  )?.data;

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.resumes)) {
    return data.resumes;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}
