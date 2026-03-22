import React, { type PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
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

const { useViewStats, useMatchJob, useCreateSnapshot, useResumeAnalytics } =
  await import('../use-resume-analytics');

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: PropsWithChildren) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

const RESUME_ID = 'resume-analytics-1';

describe('useViewStats', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
  });

  it('fetches view stats from correct URL', async () => {
    const mockStats = {
      totalViews: 100,
      uniqueVisitors: 55,
      viewsByDay: [{ date: '2024-01-15', count: 10 }],
      topSources: [{ source: 'LinkedIn', count: 30 }],
    };
    apiFetchMock.get.mockResolvedValue(mockStats);

    const { result } = renderHook(() => useViewStats(RESUME_ID), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiFetchMock.get).toHaveBeenCalledWith(
      `/api/resume-analytics/${RESUME_ID}/views`,
    );
    expect(result.current.data).toEqual(mockStats);
  });

  it('does not fetch when resumeId is empty', () => {
    const { result } = renderHook(() => useViewStats(''), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useResumeAnalytics', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
  });

  it('fetches dashboard from correct URL', async () => {
    const mockDashboard = {
      overview: {},
      viewTrend: [],
      topSources: [],
      keywordHealth: {},
      industryPosition: {},
    };
    apiFetchMock.get.mockResolvedValue(mockDashboard);

    const { result } = renderHook(() => useResumeAnalytics(RESUME_ID), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiFetchMock.get).toHaveBeenCalledWith(
      `/api/resume-analytics/${RESUME_ID}/dashboard`,
    );
  });
});

describe('useMatchJob', () => {
  beforeEach(() => {
    apiFetchMock.post.mockReset();
  });

  it('posts job description to correct URL', async () => {
    apiFetchMock.post.mockResolvedValue({
      matchScore: 85,
      matchDetails: { skills: 90, experience: 80 },
    });

    const { result } = renderHook(() => useMatchJob(RESUME_ID), {
      wrapper: createWrapper(),
    });

    const returned = await result.current.mutateAsync(
      'Senior TypeScript developer with NestJS experience',
    );

    expect(apiFetchMock.post).toHaveBeenCalledWith(
      `/api/resume-analytics/${RESUME_ID}/match-job`,
      {
        jobDescription:
          'Senior TypeScript developer with NestJS experience',
      },
    );
    expect(returned.matchScore).toBe(85);
  });
});

describe('useCreateSnapshot', () => {
  beforeEach(() => {
    apiFetchMock.post.mockReset();
  });

  it('posts to snapshot URL with empty body', async () => {
    apiFetchMock.post.mockResolvedValue({ id: 'snap-1', createdAt: '2024-01-15' });

    const { result } = renderHook(() => useCreateSnapshot(RESUME_ID), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();

    expect(apiFetchMock.post).toHaveBeenCalledWith(
      `/api/resume-analytics/${RESUME_ID}/snapshot`,
      {},
    );
  });
});
