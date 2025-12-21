import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthStore } from '../useAuthStore'
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    localStorage.clear()
  })

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login('test@example.com', 'password')
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toEqual({
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          username: 'testuser',
          image: 'https://example.com/avatar.jpg',
        })
        expect(result.current.accessToken).toBe('mock-access-token')
        expect(result.current.refreshToken).toBe('mock-refresh-token')
        expect(result.current.error).toBeNull()
      })

      // Check localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'mock-refresh-token')
    })

    it('should fail login with invalid credentials', async () => {
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        try {
          await result.current.login('wrong@example.com', 'wrongpassword')
        } catch (error) {
          // Expected to throw
        }
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
        expect(result.current.error).toBeTruthy()
      })
    })

    it('should set loading state during login', async () => {
      const { result } = renderHook(() => useAuthStore())

      let loadingDuringRequest = false

      act(() => {
        result.current.login('test@example.com', 'password').then(() => {
          // After completion
        })
      })

      await waitFor(() => {
        if (result.current.isLoading) {
          loadingDuringRequest = true
        }
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(loadingDuringRequest).toBe(true)
    })
  })

  describe('signup', () => {
    it('should signup successfully with valid data', async () => {
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.signup('New User', 'new@example.com', 'password123')
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(true)
        expect(result.current.user).toBeTruthy()
        expect(result.current.error).toBeNull()
      })
    })

    it('should fail signup with existing email', async () => {
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        try {
          await result.current.signup('Existing', 'existing@example.com', 'password123')
        } catch (error) {
          // Expected
        }
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.error).toContain('already exists')
      })
    })
  })

  describe('logout', () => {
    it('should logout and clear state', async () => {
      const { result } = renderHook(() => useAuthStore())

      // First login
      await act(async () => {
        await result.current.login('test@example.com', 'password')
      })

      await waitFor(() => expect(result.current.isAuthenticated).toBe(true))

      // Then logout
      await act(async () => {
        await result.current.logout()
      })

      await waitFor(() => {
        expect(result.current.isAuthenticated).toBe(false)
        expect(result.current.user).toBeNull()
        expect(result.current.accessToken).toBeNull()
        expect(result.current.refreshToken).toBeNull()
      })

      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    })
  })

  describe('setTokens', () => {
    it('should set tokens correctly', () => {
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.setTokens({
          accessToken: 'new-token',
          refreshToken: 'new-refresh',
        })
      })

      expect(result.current.accessToken).toBe('new-token')
      expect(result.current.refreshToken).toBe('new-refresh')
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  describe('clearAuth', () => {
    it('should clear all auth state', async () => {
      const { result } = renderHook(() => useAuthStore())

      // Login first
      await act(async () => {
        await result.current.login('test@example.com', 'password')
      })

      await waitFor(() => expect(result.current.isAuthenticated).toBe(true))

      // Clear
      act(() => {
        result.current.clearAuth()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.refreshToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})
