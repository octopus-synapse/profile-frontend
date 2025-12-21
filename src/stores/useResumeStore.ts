"use client"

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { resumeApi, type Resume } from '@/api'

interface ResumeState {
  resumes: Resume[]
  currentResume: Resume | null
  isLoading: boolean
  error: string | null

  // Actions - List
  fetchResumes: () => Promise<void>
  setCurrentResume: (resume: Resume | null) => void

  // Actions - CRUD
  createResume: (title: string, templateId?: string) => Promise<Resume>
  updateResume: (id: string, data: Partial<Resume>) => Promise<void>
  deleteResume: (id: string) => Promise<void>
  duplicateResume: (id: string) => Promise<void>

  // Actions - Load single
  loadResume: (id: string) => Promise<void>

  // Actions - Experiences
  addExperience: (resumeId: string, data: any) => Promise<void>
  updateExperience: (resumeId: string, expId: string, data: any) => Promise<void>
  deleteExperience: (resumeId: string, expId: string) => Promise<void>

  // Actions - Education
  addEducation: (resumeId: string, data: any) => Promise<void>
  updateEducation: (resumeId: string, eduId: string, data: any) => Promise<void>
  deleteEducation: (resumeId: string, eduId: string) => Promise<void>

  // Actions - Skills
  addSkill: (resumeId: string, data: any) => Promise<void>
  updateSkill: (resumeId: string, skillId: string, data: any) => Promise<void>
  deleteSkill: (resumeId: string, skillId: string) => Promise<void>

  // Actions - Clear
  clearError: () => void
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    (set, get) => ({
      resumes: [],
      currentResume: null,
      isLoading: false,
      error: null,

      // === LIST ===

      fetchResumes: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await resumeApi.list()
          set({ resumes: response.resumes, isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch resumes',
            isLoading: false,
          })
        }
      },

      loadResume: async (id: string) => {
        set({ isLoading: true, error: null })
        try {
          const response = await resumeApi.get(id)
          set({ currentResume: response.resume, isLoading: false })
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to load resume',
            isLoading: false,
          })
        }
      },

      setCurrentResume: (resume) => set({ currentResume: resume }),

      // === CRUD ===

      createResume: async (title, templateId) => {
        set({ isLoading: true, error: null })
        try {
          const resume = await resumeApi.create({ title, templateId })
          set((state) => ({
            resumes: [...state.resumes, resume],
            currentResume: resume,
            isLoading: false,
          }))
          return resume
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to create resume',
            isLoading: false,
          })
          throw error
        }
      },

      updateResume: async (id, data) => {
        set({ isLoading: true, error: null })
        try {
          const updated = await resumeApi.update(id, data)
          set((state) => ({
            resumes: state.resumes.map((r) => (r.id === id ? updated : r)),
            currentResume: state.currentResume?.id === id ? updated : state.currentResume,
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to update resume',
            isLoading: false,
          })
          throw error
        }
      },

      deleteResume: async (id) => {
        set({ isLoading: true, error: null })
        try {
          await resumeApi.delete(id)
          set((state) => ({
            resumes: state.resumes.filter((r) => r.id !== id),
            currentResume: state.currentResume?.id === id ? null : state.currentResume,
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to delete resume',
            isLoading: false,
          })
          throw error
        }
      },

      duplicateResume: async (id) => {
        set({ isLoading: true, error: null })
        try {
          const duplicated = await resumeApi.duplicate(id)
          set((state) => ({
            resumes: [...state.resumes, duplicated],
            isLoading: false,
          }))
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to duplicate resume',
            isLoading: false,
          })
          throw error
        }
      },

      // === EXPERIENCES ===

      addExperience: async (resumeId, data) => {
        try {
          const experience = await resumeApi.addExperience(resumeId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  experiences: [...(state.currentResume.experiences || []), experience],
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add experience' })
          throw error
        }
      },

      updateExperience: async (resumeId, expId, data) => {
        try {
          const updated = await resumeApi.updateExperience(resumeId, expId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  experiences: state.currentResume.experiences?.map((exp) =>
                    exp.id === expId ? updated : exp
                  ),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update experience' })
          throw error
        }
      },

      deleteExperience: async (resumeId, expId) => {
        try {
          await resumeApi.deleteExperience(resumeId, expId)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  experiences: state.currentResume.experiences?.filter((exp) => exp.id !== expId),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete experience' })
          throw error
        }
      },

      // === EDUCATION ===

      addEducation: async (resumeId, data) => {
        try {
          const education = await resumeApi.addEducation(resumeId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  education: [...(state.currentResume.education || []), education],
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add education' })
          throw error
        }
      },

      updateEducation: async (resumeId, eduId, data) => {
        try {
          const updated = await resumeApi.updateEducation(resumeId, eduId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  education: state.currentResume.education?.map((edu) =>
                    edu.id === eduId ? updated : edu
                  ),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update education' })
          throw error
        }
      },

      deleteEducation: async (resumeId, eduId) => {
        try {
          await resumeApi.deleteEducation(resumeId, eduId)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  education: state.currentResume.education?.filter((edu) => edu.id !== eduId),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete education' })
          throw error
        }
      },

      // === SKILLS ===

      addSkill: async (resumeId, data) => {
        try {
          const skill = await resumeApi.addSkill(resumeId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  skills: [...(state.currentResume.skills || []), skill],
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to add skill' })
          throw error
        }
      },

      updateSkill: async (resumeId, skillId, data) => {
        try {
          const updated = await resumeApi.updateSkill(resumeId, skillId, data)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  skills: state.currentResume.skills?.map((skill) =>
                    skill.id === skillId ? updated : skill
                  ),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to update skill' })
          throw error
        }
      },

      deleteSkill: async (resumeId, skillId) => {
        try {
          await resumeApi.deleteSkill(resumeId, skillId)
          set((state) => {
            if (state.currentResume?.id === resumeId) {
              return {
                currentResume: {
                  ...state.currentResume,
                  skills: state.currentResume.skills?.filter((skill) => skill.id !== skillId),
                },
              }
            }
            return state
          })
        } catch (error: any) {
          set({ error: error.response?.data?.message || 'Failed to delete skill' })
          throw error
        }
      },

      // === UTILS ===

      clearError: () => set({ error: null }),
    }),
    { name: 'ResumeStore' }
  )
)
