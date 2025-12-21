import { renderHook, act, waitFor } from '@testing-library/react'
import { useResumeStore } from '../useResumeStore'
import { mockResume } from '@/__tests__/mocks/handlers'

describe('useResumeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useResumeStore.setState({
      resumes: [],
      currentResume: null,
      isLoading: false,
      error: null,
    })
  })

  describe('fetchResumes', () => {
    it('should fetch resumes successfully', async () => {
      const { result } = renderHook(() => useResumeStore())

      await act(async () => {
        await result.current.fetchResumes()
      })

      await waitFor(() => {
        expect(result.current.resumes).toHaveLength(1)
        expect(result.current.resumes[0]).toMatchObject({
          id: 'resume-1',
          title: 'My Resume',
        })
        expect(result.current.isLoading).toBe(false)
        expect(result.current.error).toBeNull()
      })
    })

    it('should set loading state while fetching', async () => {
      const { result } = renderHook(() => useResumeStore())

      let wasLoading = false

      act(() => {
        result.current.fetchResumes()
      })

      await waitFor(() => {
        if (result.current.isLoading) {
          wasLoading = true
        }
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(wasLoading).toBe(true)
    })
  })

  describe('createResume', () => {
    it('should create a new resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      let createdResume

      await act(async () => {
        createdResume = await result.current.createResume('New Resume', 'modern')
      })

      await waitFor(() => {
        expect(result.current.resumes).toHaveLength(1)
        expect(result.current.currentResume).toBeTruthy()
        expect(result.current.currentResume?.title).toBe('New Resume')
      })

      expect(createdResume).toBeTruthy()
    })
  })

  describe('updateResume', () => {
    it('should update an existing resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      // First create a resume
      await act(async () => {
        await result.current.createResume('Original Title')
      })

      const resumeId = result.current.currentResume!.id

      // Then update it
      await act(async () => {
        await result.current.updateResume(resumeId, { title: 'Updated Title' })
      })

      await waitFor(() => {
        expect(result.current.currentResume?.title).toBe('Updated Title')
      })
    })
  })

  describe('deleteResume', () => {
    it('should delete a resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      // Create a resume
      await act(async () => {
        await result.current.createResume('To Delete')
      })

      const resumeId = result.current.currentResume!.id

      expect(result.current.resumes).toHaveLength(1)

      // Delete it
      await act(async () => {
        await result.current.deleteResume(resumeId)
      })

      await waitFor(() => {
        expect(result.current.resumes).toHaveLength(0)
        expect(result.current.currentResume).toBeNull()
      })
    })
  })

  describe('loadResume', () => {
    it('should load a specific resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      await act(async () => {
        await result.current.loadResume('resume-1')
      })

      await waitFor(() => {
        expect(result.current.currentResume).toBeTruthy()
        expect(result.current.currentResume?.id).toBe('resume-1')
      })
    })
  })

  describe('experiences', () => {
    it('should add an experience to resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      // Load a resume first
      await act(async () => {
        await result.current.loadResume('resume-1')
      })

      const experienceData = {
        company: 'Test Company',
        position: 'Developer',
        startDate: '2024-01-01',
        endDate: null,
        current: true,
        order: 0,
      }

      await act(async () => {
        await result.current.addExperience('resume-1', experienceData)
      })

      await waitFor(() => {
        expect(result.current.currentResume?.experiences).toHaveLength(1)
        expect(result.current.currentResume?.experiences?.[0].company).toBe('Test Company')
      })
    })

    it('should delete an experience', async () => {
      const { result } = renderHook(() => useResumeStore())

      await act(async () => {
        await result.current.loadResume('resume-1')
      })

      // Add experience
      await act(async () => {
        await result.current.addExperience('resume-1', {
          company: 'Test',
          position: 'Dev',
          startDate: '2024-01-01',
          current: true,
          order: 0,
        })
      })

      const expId = result.current.currentResume?.experiences?.[0].id

      // Delete it
      await act(async () => {
        await result.current.deleteExperience('resume-1', expId!)
      })

      await waitFor(() => {
        expect(result.current.currentResume?.experiences).toHaveLength(0)
      })
    })
  })

  describe('education', () => {
    it('should add education to resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      await act(async () => {
        await result.current.loadResume('resume-1')
      })

      const educationData = {
        institution: 'Test University',
        degree: 'Bachelor',
        field: 'Computer Science',
        startDate: '2020-01-01',
        current: false,
        order: 0,
      }

      await act(async () => {
        await result.current.addEducation('resume-1', educationData)
      })

      await waitFor(() => {
        expect(result.current.currentResume?.education).toHaveLength(1)
        expect(result.current.currentResume?.education?.[0].institution).toBe('Test University')
      })
    })
  })

  describe('skills', () => {
    it('should add a skill to resume', async () => {
      const { result } = renderHook(() => useResumeStore())

      await act(async () => {
        await result.current.loadResume('resume-1')
      })

      await act(async () => {
        await result.current.addSkill('resume-1', {
          name: 'TypeScript',
          level: 'advanced',
          order: 0,
        })
      })

      await waitFor(() => {
        expect(result.current.currentResume?.skills).toHaveLength(1)
        expect(result.current.currentResume?.skills?.[0].name).toBe('TypeScript')
      })
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useResumeStore())

      // Set error manually
      act(() => {
        useResumeStore.setState({ error: 'Test error' })
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
