import { beforeEach, describe, expect, it, mock, type Mock } from 'bun:test';

const httpClientMock = {
  get: mock(),
  post: mock(),
  patch: mock(),
  delete: mock(),
};

void mock.module('@/shared/lib/http-client', () => ({
  httpClient: httpClientMock,
}));

const repoModule = await import('../generic-sections-repository');
const { clearResumeCacheGeneric, genericSectionsRepository } = repoModule;

describe('genericSectionsRepository', () => {
  beforeEach(() => {
    clearResumeCacheGeneric();
    httpClientMock.get.mockReset();
    httpClientMock.post.mockReset();
    httpClientMock.patch.mockReset();
    httpClientMock.delete.mockReset();
  });

  it('reuses the existing resume when the resumes API returns paginated data', async () => {
    httpClientMock.get.mockImplementation((url: string) => {
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

    expect(httpClientMock.post).not.toHaveBeenCalled();
    expect(httpClientMock.get).toHaveBeenCalledWith('/api/v1/resumes/resume-1/sections/types');
  });
});
