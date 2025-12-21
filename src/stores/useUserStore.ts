"use client"

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { userApi, type User, type UserPreferences } from '@/api'

interface UserState {
  user: User | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchProfile: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  updatePreferences: (data: Partial<UserPreferences>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  clearError: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      preferences: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await userApi.getProfile()
          set({
            user: response.user,
            preferences: response.preferences,
            isLoading: false,
          })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch profile',
            isLoading: false,
          })
        }
      },

      updateProfile: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const updated = await userApi.updateMe(data)
          set({ user: updated, isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update profile',
            isLoading: false,
          })
          throw error
        }
      },

      updatePreferences: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const updated = await userApi.updatePreferences(data)
          set({ preferences: updated, isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update preferences',
            isLoading: false,
          })
          throw error
        }
      },

      uploadAvatar: async (file) => {
        set({ isLoading: true, error: null })
        try {
          const response = await userApi.uploadAvatar(file)
          set((state) => ({
            user: state.user ? { ...state.user, image: response.url } : null,
            isLoading: false,
          }))
          return response.url
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to upload avatar',
            isLoading: false,
          })
          throw error
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'UserStore' }
  )
)
