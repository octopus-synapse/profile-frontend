import { api, apiRequest } from './client'
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from './types/auth'

export const authApi = {
  /**
   * Login com email e senha
   */
  login: (data: LoginRequest) =>
    apiRequest<AuthResponse>(api.post('/auth/login', data)),

  /**
   * Cadastro de novo usuário
   */
  signup: (data: SignupRequest) =>
    apiRequest<AuthResponse>(api.post('/auth/signup', data)),

  /**
   * Refresh do access token
   */
  refreshToken: (data: RefreshTokenRequest) =>
    apiRequest<RefreshTokenResponse>(api.post('/auth/refresh', data)),

  /**
   * Logout (invalida refresh token)
   */
  logout: () =>
    apiRequest<void>(api.post('/auth/logout')),

  /**
   * Login com Google OAuth
   */
  googleLogin: (token: string) =>
    apiRequest<AuthResponse>(api.post('/auth/google', { token })),

  /**
   * Login com GitHub OAuth
   */
  githubLogin: (code: string) =>
    apiRequest<AuthResponse>(api.post('/auth/github', { code })),

  /**
   * Verifica se o token atual é válido
   */
  validateToken: () =>
    apiRequest<{ valid: boolean }>(api.get('/auth/validate')),
}
