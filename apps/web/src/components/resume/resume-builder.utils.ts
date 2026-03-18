interface ResumeListItem {
  id: string;
}

interface PaginatedResumesData {
  data?: ResumeListItem[];
}

interface ResumesQueryResponse {
  data?: PaginatedResumesData;
}

export function extractResumeListItems(
  response: ResumesQueryResponse | undefined,
): ResumeListItem[] {
  const resumes = response?.data?.data;
  return Array.isArray(resumes) ? resumes : [];
}
