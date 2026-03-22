import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
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

const { useCurrentResumeId } = await import('../use-current-resume-id');

function wrapperFactory() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
}

function ResumeIdProbe() {
  const query = useCurrentResumeId();

  if (query.isPending) {
    return React.createElement('div', null, 'loading');
  }

  if (query.isError) {
    return React.createElement('div', null, 'error');
  }

  return React.createElement('div', null, query.data);
}

describe('useCurrentResumeId', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
    apiFetchMock.post.mockReset();
  });

  it('uses the existing resume id when the backend returns paginated data', async () => {
    apiFetchMock.get.mockResolvedValue({
      data: [{ id: 'resume-1', title: 'Primary Resume' }],
      meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
    });

    render(React.createElement(ResumeIdProbe), {
      wrapper: wrapperFactory(),
    });

    await waitFor(() => {
      expect(screen.getByText('resume-1')).not.toBeNull();
    });

    expect(apiFetchMock.post).not.toHaveBeenCalled();
  });
});
