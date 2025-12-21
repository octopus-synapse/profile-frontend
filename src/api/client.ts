import axios, { AxiosError, AxiosInstance } from 'axios'
import { env } from '@/config/env'

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: env.apiUrl,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Para cookies de sessão
  })

  // Request interceptor - adiciona token se disponível
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - trata erros globalmente
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      // Se 401 e não é rota de refresh, tenta refresh token
      if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes('/auth/refresh')) {
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) {
            throw new Error('No refresh token')
          }

          const { data } = await axios.post(`${env.apiUrl}/auth/refresh`, { refreshToken })

          localStorage.setItem('accessToken', data.accessToken)

          // Retry request original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          }
          return client(originalRequest)
        } catch (refreshError) {
          // Refresh falhou, fazer logout
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/auth/signin'
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return client
}

export const api = createApiClient()

// Helper para extrair data das responses
export const apiRequest = async <T>(request: Promise<any>): Promise<T> => {
  const response = await request
  return response.data
}
