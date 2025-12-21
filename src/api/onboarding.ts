import { api, apiRequest } from './client'

export interface OnboardingData {
  // Step 1: Personal Info
  name?: string
  username?: string
  bio?: string
  location?: string

  // Step 2: Professional Info
  currentPosition?: string
  currentCompany?: string
  yearsOfExperience?: number

  // Step 3: Skills & Interests
  skills?: string[]
  interests?: string[]

  // Step 4: Social Links
  linkedin?: string
  github?: string
  website?: string
  twitter?: string

  // Flags
  completedOnboarding?: boolean
  onboardingStep?: number
}

export interface OnboardingStatusResponse {
  completed: boolean
  currentStep: number
  data: OnboardingData
}

export const onboardingApi = {
  /**
   * Obter status do onboarding
   */
  getStatus: () =>
    apiRequest<OnboardingStatusResponse>(api.get('/onboarding/status')),

  /**
   * Salvar dados do onboarding (parcial ou completo)
   */
  saveProgress: (data: OnboardingData) =>
    apiRequest<OnboardingStatusResponse>(api.post('/onboarding/progress', data)),

  /**
   * Completar onboarding
   */
  complete: (data: OnboardingData) =>
    apiRequest<OnboardingStatusResponse>(api.post('/onboarding/complete', data)),

  /**
   * Pular onboarding
   */
  skip: () =>
    apiRequest<void>(api.post('/onboarding/skip')),

  /**
   * Resetar onboarding (para refazer)
   */
  reset: () =>
    apiRequest<void>(api.post('/onboarding/reset')),
}
