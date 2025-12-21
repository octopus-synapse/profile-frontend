/**
 * Integration Test: Resume CRUD Flow
 *
 * Tests the complete resume management flow:
 * 1. Create resume
 * 2. Add experiences, education, skills
 * 3. Update resume
 * 4. Delete resume
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useResumeStore } from '@/stores/useResumeStore'
import { useAuthStore } from '@/stores/useAuthStore'

describe('Integration: Resume CRUD Flow', () => {
  beforeEach(() => {
    // Reset stores
    useResumeStore.setState({
      resumes: [],
      currentResume: null,
      isLoading: false,
      error: null,
    })
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
  })

  it('should complete full resume creation and editing flow', async () => {
    const authHook = renderHook(() => useAuthStore())
    const resumeHook = renderHook(() => useResumeStore())

    // Step 1: Login first
    await act(async () => {
      await authHook.result.current.login('test@example.com', 'password')
    })

    await waitFor(() => {
      expect(authHook.result.current.isAuthenticated).toBe(true)
    })

    // Step 2: Create a new resume
    let resume
    await act(async () => {
      resume = await resumeHook.result.current.createResume('My Professional Resume', 'modern')
    })

    await waitFor(() => {
      expect(resumeHook.result.current.resumes).toHaveLength(1)
      expect(resumeHook.result.current.currentResume?.title).toBe('My Professional Resume')
    })

    const resumeId = resumeHook.result.current.currentResume!.id

    // Step 3: Add experience
    await act(async () => {
      await resumeHook.result.current.addExperience(resumeId, {
        company: 'Tech Corp',
        position: 'Senior Developer',
        startDate: '2022-01-01',
        endDate: null,
        current: true,
        description: 'Working on amazing projects',
        order: 0,
      })
    })

    await waitFor(() => {
      expect(resumeHook.result.current.currentResume?.experiences).toHaveLength(1)
      expect(resumeHook.result.current.currentResume?.experiences?.[0].company).toBe('Tech Corp')
    })

    // Step 4: Add education
    await act(async () => {
      await resumeHook.result.current.addEducation(resumeId, {
        institution: 'University of Testing',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2018-01-01',
        endDate: '2022-01-01',
        current: false,
        order: 0,
      })
    })

    await waitFor(() => {
      expect(resumeHook.result.current.currentResume?.education).toHaveLength(1)
    })

    // Step 5: Add multiple skills
    await act(async () => {
      await resumeHook.result.current.addSkill(resumeId, {
        name: 'TypeScript',
        level: 'advanced',
        category: 'Programming',
        order: 0,
      })
      await resumeHook.result.current.addSkill(resumeId, {
        name: 'React',
        level: 'expert',
        category: 'Framework',
        order: 1,
      })
    })

    await waitFor(() => {
      expect(resumeHook.result.current.currentResume?.skills).toHaveLength(2)
    })

    // Step 6: Update resume title
    await act(async () => {
      await resumeHook.result.current.updateResume(resumeId, {
        title: 'Updated Resume Title',
        isPublic: true,
      })
    })

    await waitFor(() => {
      expect(resumeHook.result.current.currentResume?.title).toBe('Updated Resume Title')
      expect(resumeHook.result.current.currentResume?.isPublic).toBe(true)
    })

    // Step 7: Delete an experience
    const expId = resumeHook.result.current.currentResume?.experiences?.[0].id
    await act(async () => {
      await resumeHook.result.current.deleteExperience(resumeId, expId!)
    })

    await waitFor(() => {
      expect(resumeHook.result.current.currentResume?.experiences).toHaveLength(0)
    })

    // Step 8: Duplicate resume
    await act(async () => {
      await resumeHook.result.current.duplicateResume(resumeId)
    })

    await waitFor(() => {
      expect(resumeHook.result.current.resumes).toHaveLength(2)
    })

    // Step 9: Delete original resume
    await act(async () => {
      await resumeHook.result.current.deleteResume(resumeId)
    })

    await waitFor(() => {
      expect(resumeHook.result.current.resumes).toHaveLength(1)
      expect(resumeHook.result.current.currentResume).toBeNull()
    })
  })

  it('should handle multiple resumes', async () => {
    const { result } = renderHook(() => useResumeStore())

    // Create multiple resumes
    await act(async () => {
      await result.current.createResume('Resume 1')
      await result.current.createResume('Resume 2')
      await result.current.createResume('Resume 3')
    })

    await waitFor(() => {
      expect(result.current.resumes).toHaveLength(3)
    })
  })

  it('should maintain resume state across operations', async () => {
    const { result } = renderHook(() => useResumeStore())

    // Create resume
    await act(async () => {
      await result.current.createResume('State Test Resume')
    })

    const resumeId = result.current.currentResume!.id

    // Add experience
    await act(async () => {
      await result.current.addExperience(resumeId, {
        company: 'Company A',
        position: 'Dev',
        startDate: '2024-01-01',
        current: true,
        order: 0,
      })
    })

    // Add skill
    await act(async () => {
      await result.current.addSkill(resumeId, {
        name: 'JavaScript',
        order: 0,
      })
    })

    // Both should be present
    await waitFor(() => {
      expect(result.current.currentResume?.experiences).toHaveLength(1)
      expect(result.current.currentResume?.skills).toHaveLength(1)
    })

    // Update experience should not affect skills
    const expId = result.current.currentResume?.experiences?.[0].id
    await act(async () => {
      await result.current.updateExperience(resumeId, expId!, {
        company: 'Company B',
      })
    })

    await waitFor(() => {
      expect(result.current.currentResume?.experiences?.[0].company).toBe('Company B')
      expect(result.current.currentResume?.skills).toHaveLength(1) // Still there
    })
  })

  it('should handle errors gracefully', async () => {
    const { result } = renderHook(() => useResumeStore())

    // Try to delete non-existent resume
    await act(async () => {
      try {
        await result.current.deleteResume('non-existent-id')
      } catch (error) {
        // Expected
      }
    })

    // Store should still be functional
    await act(async () => {
      await result.current.createResume('After Error')
    })

    await waitFor(() => {
      expect(result.current.resumes).toHaveLength(1)
    })
  })
})
