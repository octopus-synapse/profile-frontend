"use client"

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { onboardingApi, type OnboardingData } from '@/api'

interface OnboardingState {
  data: OnboardingData
  currentStep: number
  isCompleted: boolean
  isLoading: boolean
  error: string | null

  // Actions
  fetchStatus: () => Promise<void>
  saveProgress: (data: Partial<OnboardingData>) => Promise<void>
  completeOnboarding: () => Promise<void>
  skipOnboarding: () => Promise<void>
  setStep: (step: number) => void
  updateData: (data: Partial<OnboardingData>) => void
  clearError: () => void
}

export const useOnboardingStore = create<OnboardingState>()(
  devtools(
    persist(
      (set, get) => ({
        data: {},
        currentStep: 1,
        isCompleted: false,
        isLoading: false,
        error: null,

        fetchStatus: async () => {
          set({ isLoading: true, error: null })
          try {
            const response = await onboardingApi.getStatus()
            set({
              data: response.data,
              currentStep: response.currentStep,
              isCompleted: response.completed,
              isLoading: false,
            })
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to fetch onboarding status',
              isLoading: false,
            })
          }
        },

        saveProgress: async (newData) => {
          set({ isLoading: true, error: null })
          try {
            const currentData = get().data
            const merged = { ...currentData, ...newData }
            const response = await onboardingApi.saveProgress(merged)
            set({
              data: response.data,
              currentStep: response.currentStep,
              isCompleted: response.completed,
              isLoading: false,
            })
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to save progress',
              isLoading: false,
            })
            throw error
          }
        },

        completeOnboarding: async () => {
          set({ isLoading: true, error: null })
          try {
            const data = get().data
            await onboardingApi.complete(data)
            set({ isCompleted: true, isLoading: false })
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to complete onboarding',
              isLoading: false,
            })
            throw error
          }
        },

        skipOnboarding: async () => {
          set({ isLoading: true, error: null })
          try {
            await onboardingApi.skip()
            set({ isCompleted: true, isLoading: false })
          } catch (error: any) {
            set({
              error: error.response?.data?.message || 'Failed to skip onboarding',
              isLoading: false,
            })
            throw error
          }
        },

        setStep: (step) => set({ currentStep: step }),

        updateData: (data) =>
          set((state) => ({
            data: { ...state.data, ...data },
          })),

        clearError: () => set({ error: null }),
      }),
      {
        name: 'onboarding-storage',
        partialize: (state) => ({
          currentStep: state.currentStep,
          isCompleted: state.isCompleted,
        }),
      }
    ),
    { name: 'OnboardingStore' }
  )
)
