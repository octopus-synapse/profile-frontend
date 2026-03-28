import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { renderHook } from '@testing-library/react';
import { API_CLIENT_MOCK_BASE } from '@/__test-utils__/api-client-mock-base';

const isApiErrorMock = mock();

void mock.module('@profile/api-client', () => ({
  ...API_CLIENT_MOCK_BASE,
  apiFetch: { get: mock(), post: mock(), patch: mock(), put: mock(), delete: mock() },
  customFetch: mock(),
  isApiError: isApiErrorMock,
}));

void mock.module('@/shared/components/ui/toast', () => ({
  showToast: { error: mock(), success: mock(), info: mock() },
}));

const { useErrorHandler } = await import('../use-error-handler');

function makeApiError(statusCode: number, message = 'Error') {
  return { code: 'ERR', message, statusCode, details: {} };
}

describe('useErrorHandler', () => {
  beforeEach(() => {
    isApiErrorMock.mockReset();
  });

  // ==========================================================================
  // classifyError — API error classification
  // ==========================================================================

  describe('classifyError', () => {
    it('classifies 401 as auth', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(makeApiError(401));
      expect(classified.category).toBe('auth');
    });

    it('classifies 403 as permission', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(makeApiError(403));
      expect(classified.category).toBe('permission');
    });

    it('classifies 404 as not_found', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(makeApiError(404));
      expect(classified.category).toBe('not_found');
    });

    it('classifies 409 as conflict', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(makeApiError(409));
      expect(classified.category).toBe('conflict');
    });

    it('classifies backend envelope conflict errors', () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError({
        success: false,
        error: {
          code: 'CONFLICT',
          message: 'An account with this email already exists',
          details: {},
        },
      });
      expect(classified.category).toBe('conflict');
      expect(classified.message).toBe('An account with this email already exists');
    });

    it('classifies 400 as validation', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(
        makeApiError(400, 'Bad request'),
      );
      expect(classified.category).toBe('validation');
    });

    it('classifies 500+ as unexpected', () => {
      isApiErrorMock.mockReturnValue(true);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(makeApiError(500));
      expect(classified.category).toBe('unexpected');
    });

    it('classifies TypeError with fetch as network', () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(
        new TypeError('Failed to fetch'),
      );
      expect(classified.category).toBe('network');
    });

    it('classifies generic Error as unexpected', () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError(
        new Error('Something broke'),
      );
      expect(classified.category).toBe('unexpected');
      expect(classified.message).toBe('Something broke');
    });

    it('classifies non-Error values as unexpected', () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());
      const classified = result.current.classifyError('string error');
      expect(classified.category).toBe('unexpected');
    });
  });

  // ==========================================================================
  // handleAsync
  // ==========================================================================

  describe('handleAsync', () => {
    it('returns result on success', async () => {
      const { result } = renderHook(() => useErrorHandler());

      const value = await result.current.handleAsync(
        Promise.resolve({ data: 42 }),
      );

      expect(value).toEqual({ data: 42 });
    });

    it('returns null on error by default', async () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());

      const value = await result.current.handleAsync(
        Promise.reject(new Error('fail')),
      );

      expect(value).toBeNull();
    });

    it('calls onError callback with classified error', async () => {
      isApiErrorMock.mockReturnValue(true);
      const onError = mock();
      const { result } = renderHook(() => useErrorHandler());

      await result.current.handleAsync(
        Promise.reject(makeApiError(404, 'Not found')),
        { onError },
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError.mock.calls[0]?.[0]?.category).toBe('not_found');
    });

    it('rethrows when rethrow option is true', async () => {
      isApiErrorMock.mockReturnValue(false);
      const { result } = renderHook(() => useErrorHandler());

      let caught = false;
      try {
        await result.current.handleAsync(
          Promise.reject(new Error('rethrown')),
          { rethrow: true },
        );
      } catch {
        caught = true;
      }

      expect(caught).toBe(true);
    });
  });
});
