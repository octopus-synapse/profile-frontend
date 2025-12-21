import { api, apiRequest } from './client'
import type {
  User,
  UserPreferences,
  UpdateUserRequest,
  UpdatePreferencesRequest,
  UserProfileResponse,
} from './types/user'

export const userApi = {
  /**
   * Obter perfil do usuário logado
   */
  getMe: () =>
    apiRequest<User>(api.get('/users/me')),

  /**
   * Obter perfil completo (user + preferences)
   */
  getProfile: () =>
    apiRequest<UserProfileResponse>(api.get('/users/me/profile')),

  /**
   * Atualizar dados do usuário
   */
  updateMe: (data: UpdateUserRequest) =>
    apiRequest<User>(api.patch('/users/me', data)),

  /**
   * Obter preferências do usuário
   */
  getPreferences: () =>
    apiRequest<UserPreferences>(api.get('/users/me/preferences')),

  /**
   * Atualizar preferências
   */
  updatePreferences: (data: UpdatePreferencesRequest) =>
    apiRequest<UserPreferences>(api.patch('/users/me/preferences', data)),

  /**
   * Upload de foto de perfil
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiRequest<{ url: string }>(
      api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  },

  /**
   * Deletar conta
   */
  deleteAccount: () =>
    apiRequest<void>(api.delete('/users/me')),

  /**
   * Obter perfil público de um usuário
   */
  getPublicProfile: (username: string) =>
    apiRequest<User>(api.get(`/users/${username}`)),
}
