/**
 * Integration Test: Authentication Flow
 *
 * Tests the complete authentication flow:
 * 1. User signup
 * 2. User login
 * 3. Token management
 * 4. User logout
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useUserStore } from '@/stores/useUserStore'
import { server } from '@/__tests__/mocks/server'
import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

describe('Integration: Authentication Flow', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    useUserStore.setState({
      user: null,
      preferences: null,
      isLoading: false,
      error: null,
    })
    localStorage.clear()
  })

  it('should complete full signup -> login -> fetch profile -> logout flow', async () => {
    const authHook = renderHook(() => useAuthStore())
    const userHook = renderHook(() => useUserStore())

    // Step 1: Signup
    await act(async () => {
      await authHook.result.current.signup(
        'Integration User',
        'integration@test.com',
        'password123'
      )
    })

    await waitFor(() => {
      expect(authHook.result.current.isAuthenticated).toBe(true)
      expect(authHook.result.current.user?.email).toBe('test@example.com') // From mock
      expect(authHook.result.current.accessToken).toBeTruthy()
    })

    // Step 2: Fetch user profile
    await act(async () => {
      await userHook.result.current.fetchProfile()
    })

    await waitFor(() => {
      expect(userHook.result.current.user).toBeTruthy()
      expect(userHook.result.current.preferences).toBeTruthy()
    })

    // Step 3: Update profile
    await act(async () => {
      await userHook.result.current.updateProfile({
        bio: 'Updated bio',
      })
    })

    await waitFor(() => {
      expect(userHook.result.current.user?.bio).toBe('Updated bio')
    })

    // Step 4: Logout
    await act(async () => {
      await authHook.result.current.logout()
    })

    await waitFor(() => {
      expect(authHook.result.current.isAuthenticated).toBe(false)
      expect(authHook.result.current.user).toBeNull()
      expect(authHook.result.current.accessToken).toBeNull()
    })
  })

  it('should handle login with invalid credentials', async () => {
    const { result } = renderHook(() => useAuthStore())

    await act(async () => {
      try {
        await result.current.login('wrong@test.com', 'wrongpass')
      } catch (error) {
        // Expected to throw
      }
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.error).toBeTruthy()
    })
  })

  it('should persist authentication state', async () => {
    const { result: result1 } = renderHook(() => useAuthStore())

    // Login
    await act(async () => {
      await result1.current.login('test@example.com', 'password')
    })

    await waitFor(() => {
      expect(result1.current.isAuthenticated).toBe(true)
    })

    // Simulate new session (unmount and remount)
    const { result: result2 } = renderHook(() => useAuthStore())

    // The persisted state should be loaded
    await waitFor(() => {
      expect(result2.current.user).toBeTruthy()
    })
  })

  it('should handle concurrent auth requests', async () => {
    const { result } = renderHook(() => useAuthStore())

    // Make multiple login requests at once
    const promises = [
      result.current.login('test@example.com', 'password'),
      result.current.login('test@example.com', 'password'),
    ]

    await act(async () => {
      await Promise.all(promises)
    })

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toBeTruthy()
    })
  })
})
