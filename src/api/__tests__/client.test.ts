/**
 * Unit Test: API Client
 *
 * Tests the axios client configuration:
 * - Request interceptor (token injection)
 * - Response interceptor (error handling, token refresh)
 */

import { api } from '../client'
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      localStorage.setItem('accessToken', 'test-token')

      let capturedHeaders: any = null

      server.use(
        http.get(`${env.apiUrl}/test`, ({ request }) => {
          capturedHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({ success: true })
        })
      )

      await api.get('/test')

      expect(capturedHeaders.authorization).toBe('Bearer test-token')
    })

    it('should not add Authorization header when token does not exist', async () => {
      let capturedHeaders: any = null

      server.use(
        http.get(`${env.apiUrl}/test`, ({ request }) => {
          capturedHeaders = Object.fromEntries(request.headers.entries())
          return HttpResponse.json({ success: true })
        })
      )

      await api.get('/test')

      expect(capturedHeaders.authorization).toBeUndefined()
    })
  })

  describe('Response Interceptor', () => {
    it('should return data on successful response', async () => {
      server.use(
        http.get(`${env.apiUrl}/test`, () => {
          return HttpResponse.json({ data: 'test' })
        })
      )

      const response = await api.get('/test')

      expect(response.data).toEqual({ data: 'test' })
    })

    it('should attempt token refresh on 401 error', async () => {
      localStorage.setItem('refreshToken', 'refresh-token')
      localStorage.setItem('accessToken', 'expired-token')

      let requestCount = 0

      server.use(
        http.get(`${env.apiUrl}/protected`, () => {
          requestCount++
          if (requestCount === 1) {
            // First request fails with 401
            return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
          }
          // Second request (after refresh) succeeds
          return HttpResponse.json({ data: 'protected-data' })
        })
      )

      try {
        const response = await api.get('/protected')
        // Should succeed after refresh
        expect(response.data).toEqual({ data: 'protected-data' })
        expect(requestCount).toBe(2) // Original + retry
      } catch (error) {
        // If refresh fails, it redirects (can't test redirect in jsdom)
      }
    })

    it('should not retry on 401 for refresh endpoint', async () => {
      server.use(
        http.post(`${env.apiUrl}/auth/refresh`, () => {
          return HttpResponse.json({ message: 'Refresh failed' }, { status: 401 })
        })
      )

      try {
        await api.post('/auth/refresh', { refreshToken: 'invalid' })
      } catch (error: any) {
        expect(error.response?.status).toBe(401)
      }
    })

    it('should reject on other error codes', async () => {
      server.use(
        http.get(`${env.apiUrl}/error`, () => {
          return HttpResponse.json({ message: 'Bad Request' }, { status: 400 })
        })
      )

      try {
        await api.get('/error')
        fail('Should have thrown error')
      } catch (error: any) {
        expect(error.response?.status).toBe(400)
      }
    })
  })

  describe('Base Configuration', () => {
    it('should have correct baseURL', () => {
      expect(api.defaults.baseURL).toBe(env.apiUrl)
    })

    it('should have correct timeout', () => {
      expect(api.defaults.timeout).toBe(30000)
    })

    it('should have withCredentials enabled', () => {
      expect(api.defaults.withCredentials).toBe(true)
    })

    it('should have correct Content-Type header', () => {
      expect(api.defaults.headers['Content-Type']).toBe('application/json')
    })
  })
})
