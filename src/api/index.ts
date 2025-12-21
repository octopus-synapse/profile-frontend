// API Client
export { api, apiRequest } from './client'

// API Modules
export { authApi } from './auth'
export { userApi } from './user'
export { resumeApi } from './resume'
export { exportApi } from './export'
export { onboardingApi } from './onboarding'

// Types
export type * from './types/auth'
export type * from './types/user'
export type * from './types/resume'
export type {
  ExportPDFRequest,
  ExportDOCXRequest,
  ExportBannerRequest,
  ExportResponse,
} from './export'
export type {
  OnboardingData,
  OnboardingStatusResponse,
} from './onboarding'
