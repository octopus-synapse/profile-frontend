import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { API_CLIENT_MOCK_BASE } from '@/__test-utils__/api-client-mock-base';

const apiFetchMock = {
  get: mock(),
  post: mock(),
  patch: mock(),
  put: mock(),
  delete: mock(),
};

const usersGetProfileMock = mock();
const usersUpdateProfileMock = mock();
const usersCheckUsernameAvailabilityMock = mock();
const usersGetPublicProfileByUsernameMock = mock();
const uploadUploadProfileImageMock = mock();

void mock.module('@profile/api-client', () => ({
  ...API_CLIENT_MOCK_BASE,
  apiFetch: apiFetchMock,
  customFetch: mock(),
  usersGetProfile: usersGetProfileMock,
  usersUpdateProfile: usersUpdateProfileMock,
  usersCheckUsernameAvailability: usersCheckUsernameAvailabilityMock,
  usersGetPublicProfileByUsername: usersGetPublicProfileByUsernameMock,
  uploadUploadProfileImage: uploadUploadProfileImageMock,
}));

const { userRepository } = await import('../user-repository');

describe('userRepository', () => {
  beforeEach(() => {
    apiFetchMock.get.mockReset();
    apiFetchMock.post.mockReset();
    apiFetchMock.patch.mockReset();
    apiFetchMock.delete.mockReset();
    usersGetProfileMock.mockReset();
    usersUpdateProfileMock.mockReset();
    usersCheckUsernameAvailabilityMock.mockReset();
    usersGetPublicProfileByUsernameMock.mockReset();
    uploadUploadProfileImageMock.mockReset();
  });

  // ==========================================================================
  // getMe
  // ==========================================================================

  describe('getMe', () => {
    it('returns user on success', async () => {
      const mockUser = { id: 'u1', email: 'test@example.com', name: 'Test' };
      usersGetProfileMock.mockResolvedValue(mockUser);

      const result = await userRepository.getMe();

      expect(result).toEqual(mockUser as any);
    });

    it('returns null on error', async () => {
      usersGetProfileMock.mockRejectedValue(new Error('Unauthorized'));

      const result = await userRepository.getMe();

      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // updateMe
  // ==========================================================================

  describe('updateMe', () => {
    it('maps UpdateUserDto fields to SDK parameters', async () => {
      const mockResponse = { id: 'u1', displayName: 'New Name' };
      usersUpdateProfileMock.mockResolvedValue(mockResponse);

      const result = await userRepository.updateMe({
        name: 'New Name',
        bio: 'My bio',
        location: 'NYC',
        phone: '+1234',
        image: 'https://img.url/photo.jpg',
        website: 'https://me.dev',
        linkedin: 'linkedin.com/in/me',
        github: 'github.com/me',
        twitter: '@me',
      });

      expect(usersUpdateProfileMock).toHaveBeenCalledWith({
        displayName: 'New Name',
        bio: 'My bio',
        location: 'NYC',
        phone: '+1234',
        photoURL: 'https://img.url/photo.jpg',
        website: 'https://me.dev',
        linkedin: 'linkedin.com/in/me',
        github: 'github.com/me',
        twitter: '@me',
      });
      expect(result).toEqual(mockResponse as any);
    });

    it('defaults undefined fields to empty strings', async () => {
      usersUpdateProfileMock.mockResolvedValue({});

      await userRepository.updateMe({});

      expect(usersUpdateProfileMock).toHaveBeenCalledWith({
        displayName: '',
        bio: '',
        location: '',
        phone: '',
        photoURL: undefined,
        website: undefined,
        linkedin: undefined,
        github: undefined,
        twitter: undefined,
      });
    });

    it('returns null on error', async () => {
      usersUpdateProfileMock.mockRejectedValue(new Error('Server error'));

      const result = await userRepository.updateMe({ name: 'x' });

      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // getUsers
  // ==========================================================================

  describe('getUsers', () => {
    it('builds query params from filters', async () => {
      apiFetchMock.get.mockResolvedValue({
        users: [],
        total: 0,
        page: 2,
        limit: 10,
        totalPages: 0,
      });

      await userRepository.getUsers({
        search: 'john',
        role: 'ADMIN',
        page: 2,
      });

      expect(apiFetchMock.get).toHaveBeenCalledWith(
        '/api/v1/users/manage?search=john&role=ADMIN&page=2',
      );
    });

    it('calls without query params when no filters', async () => {
      apiFetchMock.get.mockResolvedValue({
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await userRepository.getUsers();

      expect(apiFetchMock.get).toHaveBeenCalledWith('/api/v1/users/manage');
    });

    it('returns fallback on error', async () => {
      apiFetchMock.get.mockRejectedValue(new Error('fail'));

      const result = await userRepository.getUsers({ search: 'x' });

      expect(result).toEqual({
        users: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });
    });
  });

  // ==========================================================================
  // adminDeleteUser
  // ==========================================================================

  describe('adminDeleteUser', () => {
    it('calls DELETE to correct endpoint', async () => {
      apiFetchMock.delete.mockResolvedValue(undefined);

      await userRepository.adminDeleteUser('user-123');

      expect(apiFetchMock.delete).toHaveBeenCalledWith(
        '/api/v1/users/manage/user-123',
      );
    });
  });

  // ==========================================================================
  // checkUsername
  // ==========================================================================

  describe('checkUsername', () => {
    it('calls SDK function with username', async () => {
      usersCheckUsernameAvailabilityMock.mockResolvedValue({
        available: true,
      });

      const result = await userRepository.checkUsername('testuser');

      expect(usersCheckUsernameAvailabilityMock).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(result).toEqual({ available: true });
    });

    it('returns null on error', async () => {
      usersCheckUsernameAvailabilityMock.mockRejectedValue(
        new Error('Network error'),
      );

      const result = await userRepository.checkUsername('bad');

      expect(result).toBeNull();
    });
  });

  // ==========================================================================
  // adminUpdateUserRole
  // ==========================================================================

  describe('adminUpdateUserRole', () => {
    it('calls PATCH with role payload', async () => {
      apiFetchMock.patch.mockResolvedValue(undefined);

      await userRepository.adminUpdateUserRole('user-456', 'ADMIN' as any);

      expect(apiFetchMock.patch).toHaveBeenCalledWith(
        '/api/v1/users/manage/user-456',
        { role: 'ADMIN' },
      );
    });
  });
});
