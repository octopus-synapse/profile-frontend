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

const { adminRepository } = await import('../admin-repository');

describe('adminRepository', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
  });

  // ==========================================================================
  // getStats
  // ==========================================================================

  describe('getStats', () => {
    it('maps PlatformStatsData to AdminStats correctly', async () => {
      apiFetchMock.get.mockResolvedValue({
        totalUsers: 150,
        totalResumes: 320,
        totalViews: 5000,
        activeUsersToday: 42,
        activeUsersWeek: 98,
        updatedAt: '2024-01-15T10:00:00Z',
      });

      const stats = await adminRepository.getStats();

      expect(apiFetchMock.get).toHaveBeenCalledWith('/api/v1/platform/stats');
      expect(stats).toEqual({
        totalUsers: 150,
        activeUsers: 42,
        totalResumes: 320,
        publicProfiles: 0,
        newUsersToday: 42,
        newUsersThisWeek: 98,
        newUsersThisMonth: 0,
      });
    });
  });

  // ==========================================================================
  // getSystemHealth
  // ==========================================================================

  describe('getSystemHealth', () => {
    it('returns healthy when all services respond ok', async () => {
      apiFetchMock.get.mockResolvedValue({ status: 'ok' });

      const health = await adminRepository.getSystemHealth();

      expect(health.database).toBe('healthy');
      expect(health.api).toBe('healthy');
      expect(health.storage).toBe('healthy');
      expect(health.lastChecked).toBeDefined();
    });

    it('returns down for a service that rejects', async () => {
      apiFetchMock.get
        .mockResolvedValueOnce({ status: 'ok' })
        .mockRejectedValueOnce(new Error('Redis connection refused'))
        .mockResolvedValueOnce({ status: 'ok' });

      const health = await adminRepository.getSystemHealth();

      expect(health.database).toBe('healthy');
      expect(health.api).toBe('down');
      expect(health.storage).toBe('healthy');
    });

    it('returns all down when every service rejects', async () => {
      apiFetchMock.get.mockRejectedValue(new Error('Service unavailable'));

      const health = await adminRepository.getSystemHealth();

      expect(health.database).toBe('down');
      expect(health.api).toBe('down');
      expect(health.storage).toBe('down');
    });

    it('returns degraded for non-ok status', async () => {
      apiFetchMock.get.mockResolvedValue({ status: 'degraded' });

      const health = await adminRepository.getSystemHealth();

      expect(health.database).toBe('degraded');
      expect(health.api).toBe('degraded');
      expect(health.storage).toBe('degraded');
    });
  });

  // ==========================================================================
  // getRecentUsers
  // ==========================================================================

  describe('getRecentUsers', () => {
    it('calls correct URL with limit and page params', async () => {
      const mockUsers = [{ id: 'u1', email: 'a@b.com' }];
      apiFetchMock.get.mockResolvedValue({
        data: mockUsers,
        meta: { total: 1, page: 1, limit: 5, totalPages: 1 },
      });

      const result = await adminRepository.getRecentUsers(5);

      expect(apiFetchMock.get).toHaveBeenCalledWith(
        '/api/v1/users/manage?limit=5&page=1',
      );
      expect(result).toEqual(mockUsers as any);
    });

    it('passes different limit values correctly', async () => {
      apiFetchMock.get.mockResolvedValue({
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
      });

      await adminRepository.getRecentUsers(10);

      expect(apiFetchMock.get).toHaveBeenCalledWith(
        '/api/v1/users/manage?limit=10&page=1',
      );
    });
  });

  // ==========================================================================
  // getRecentActivity
  // ==========================================================================

  describe('getRecentActivity', () => {
    it('returns empty array (not yet wired)', async () => {
      const result = await adminRepository.getRecentActivity(10);
      expect(result).toEqual([]);
    });
  });
});
