import { http, HttpResponse } from 'msw'
import { env } from '@/config/env'

const API_URL = env.apiUrl

// Mock data
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  username: 'testuser',
  image: 'https://example.com/avatar.jpg',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  user: mockUser,
}

export const mockResume = {
  id: 'resume-1',
  userId: '1',
  title: 'My Resume',
  templateId: 'modern',
  colorScheme: 'blue',
  isPublic: false,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  awards: [],
}

export const mockPreferences = {
  id: 'pref-1',
  userId: '1',
  theme: 'light' as const,
  language: 'en',
  emailNotifications: true,
  profileVisibility: 'public' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

export const handlers = [
  // === AUTH ===
  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json(mockAuthResponse)
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post(`${API_URL}/auth/signup`, async ({ request }) => {
    const body = await request.json() as { name: string; email: string; password: string }

    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        { message: 'Email already exists' },
        { status: 409 }
      )
    }

    return HttpResponse.json(mockAuthResponse, { status: 201 })
  }),

  http.post(`${API_URL}/auth/logout`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post(`${API_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      accessToken: 'new-access-token',
    })
  }),

  http.get(`${API_URL}/auth/validate`, () => {
    return HttpResponse.json({ valid: true })
  }),

  // === USER ===
  http.get(`${API_URL}/users/me`, () => {
    return HttpResponse.json(mockUser)
  }),

  http.get(`${API_URL}/users/me/profile`, () => {
    return HttpResponse.json({
      user: mockUser,
      preferences: mockPreferences,
    })
  }),

  http.patch(`${API_URL}/users/me`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockUser, ...body })
  }),

  http.get(`${API_URL}/users/me/preferences`, () => {
    return HttpResponse.json(mockPreferences)
  }),

  http.patch(`${API_URL}/users/me/preferences`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockPreferences, ...body })
  }),

  http.post(`${API_URL}/users/me/avatar`, () => {
    return HttpResponse.json({ url: 'https://example.com/new-avatar.jpg' })
  }),

  // === RESUME ===
  http.get(`${API_URL}/resumes`, () => {
    return HttpResponse.json({
      resumes: [mockResume],
      total: 1,
    })
  }),

  http.get(`${API_URL}/resumes/:id`, ({ params }) => {
    return HttpResponse.json({
      resume: { ...mockResume, id: params.id },
    })
  }),

  http.post(`${API_URL}/resumes`, async ({ request }) => {
    const body = await request.json() as { title: string }
    return HttpResponse.json(
      { ...mockResume, title: body.title },
      { status: 201 }
    )
  }),

  http.patch(`${API_URL}/resumes/:id`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ ...mockResume, id: params.id, ...body })
  }),

  http.delete(`${API_URL}/resumes/:id`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  http.post(`${API_URL}/resumes/:id/duplicate`, ({ params }) => {
    return HttpResponse.json({
      ...mockResume,
      id: 'duplicated-id',
      title: `${mockResume.title} (Copy)`,
    })
  }),

  // === RESUME - EXPERIENCES ===
  http.post(`${API_URL}/resumes/:resumeId/experiences`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 'exp-1', resumeId: params.resumeId, ...body },
      { status: 201 }
    )
  }),

  http.patch(`${API_URL}/resumes/:resumeId/experiences/:expId`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.expId, resumeId: params.resumeId, ...body })
  }),

  http.delete(`${API_URL}/resumes/:resumeId/experiences/:expId`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  // === RESUME - EDUCATION ===
  http.post(`${API_URL}/resumes/:resumeId/education`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 'edu-1', resumeId: params.resumeId, ...body },
      { status: 201 }
    )
  }),

  http.patch(`${API_URL}/resumes/:resumeId/education/:eduId`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.eduId, resumeId: params.resumeId, ...body })
  }),

  http.delete(`${API_URL}/resumes/:resumeId/education/:eduId`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  // === RESUME - SKILLS ===
  http.post(`${API_URL}/resumes/:resumeId/skills`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json(
      { id: 'skill-1', resumeId: params.resumeId, ...body },
      { status: 201 }
    )
  }),

  http.patch(`${API_URL}/resumes/:resumeId/skills/:skillId`, async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.skillId, resumeId: params.resumeId, ...body })
  }),

  http.delete(`${API_URL}/resumes/:resumeId/skills/:skillId`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  // === ONBOARDING ===
  http.get(`${API_URL}/onboarding/status`, () => {
    return HttpResponse.json({
      completed: false,
      currentStep: 1,
      data: {},
    })
  }),

  http.post(`${API_URL}/onboarding/progress`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      completed: false,
      currentStep: 2,
      data: body,
    })
  }),

  http.post(`${API_URL}/onboarding/complete`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      completed: true,
      currentStep: 4,
      data: body,
    })
  }),

  http.post(`${API_URL}/onboarding/skip`, () => {
    return HttpResponse.json(null, { status: 204 })
  }),

  // === EXPORT ===
  http.post(`${API_URL}/export/pdf`, () => {
    return HttpResponse.json({
      url: 'https://example.com/resume.pdf',
      filename: 'resume.pdf',
      expiresAt: '2024-12-31T23:59:59.000Z',
    })
  }),

  http.post(`${API_URL}/export/docx`, () => {
    return HttpResponse.json({
      url: 'https://example.com/resume.docx',
      filename: 'resume.docx',
      expiresAt: '2024-12-31T23:59:59.000Z',
    })
  }),

  http.post(`${API_URL}/export/banner`, () => {
    return HttpResponse.json({
      url: 'https://example.com/banner.png',
      filename: 'banner.png',
      expiresAt: '2024-12-31T23:59:59.000Z',
    })
  }),
]
