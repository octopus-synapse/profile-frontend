import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { API_CLIENT_MOCK_BASE } from '@/__test-utils__/api-client-mock-base';

const apiFetchMock = {
  get: mock(),
  post: mock(),
  patch: mock(),
  put: mock(),
  delete: mock(),
};

void mock.module('@profile/api-client', () => ({
  ...API_CLIENT_MOCK_BASE,
  apiFetch: apiFetchMock,
  customFetch: mock(),
}));

const repoModule = await import('../generic-sections-repository');
const { clearResumeCacheGeneric, genericSectionsRepository } = repoModule;

describe('genericSectionsRepository', () => {
  beforeEach(() => {
    clearResumeCacheGeneric();
    apiFetchMock.get.mockReset();
    apiFetchMock.post.mockReset();
    apiFetchMock.patch.mockReset();
    apiFetchMock.delete.mockReset();
  });

  it('reuses the existing resume when the resumes API returns paginated data', async () => {
    apiFetchMock.get.mockImplementation((url: string) => {
      if (url === '/api/v1/resumes') {
        return Promise.resolve({
          data: [{ id: 'resume-1', title: 'Primary Resume' }],
          meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
        });
      }

      if (url === '/api/v1/resumes/resume-1/sections/types') {
        return Promise.resolve({
          sectionTypes: [],
        });
      }

      throw new Error(`Unexpected GET ${url}`);
    });

    await genericSectionsRepository.getSectionTypes();

    expect(apiFetchMock.post).not.toHaveBeenCalled();
    expect(apiFetchMock.get).toHaveBeenCalledWith('/api/v1/resumes/resume-1/sections/types');
  });
});
