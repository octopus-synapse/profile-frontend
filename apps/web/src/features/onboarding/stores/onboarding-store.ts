/**
 * Onboarding Store (Zustand)
 *
 * Nielsen Heuristics Applied:
 * - Visibility of system status: Progress tracking
 * - User control and freedom: Navigate between steps, skip optional
 * - Error prevention: Validation before proceeding
 * - Recognition rather than recall: Clear step indicators
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SubmitOnboardingDto } from "../types";

// Types aligned with backend schema
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
}

export interface ProfessionalProfile {
  jobTitle: string;
  summary: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: number;
}

export interface Language {
  id: string;
  name: string;
  level: "básico" | "intermediário" | "avançado" | "fluente" | "nativo";
}

export interface TemplateSelection {
  template: "professional";
  palette: string;
}

export type OnboardingStep =
  | "welcome"
  | "personal-info"
  | "username"
  | "professional-profile"
  | "experience"
  | "education"
  | "skills"
  | "languages"
  | "template"
  | "review"
  | "complete";

export const ONBOARDING_STEPS: {
  id: OnboardingStep;
  label: string;
  required: boolean;
  description: string;
}[] = [
  { id: "welcome", label: "init", required: true, description: "Welcome to ProFile" },
  { id: "personal-info", label: "user", required: true, description: "Personal Information" },
  { id: "username", label: "@", required: true, description: "Choose Your Username" },
  {
    id: "professional-profile",
    label: "profile",
    required: true,
    description: "Professional Profile",
  },
  { id: "experience", label: "work", required: false, description: "Work Experience" },
  { id: "education", label: "edu", required: false, description: "Education" },
  { id: "skills", label: "skills", required: true, description: "Technical Skills" },
  { id: "languages", label: "lang", required: false, description: "Languages" },
  { id: "template", label: "theme", required: true, description: "Choose Your Theme" },
  { id: "review", label: "review", required: true, description: "Review & Submit" },
  { id: "complete", label: "done", required: true, description: "Setup Complete" },
];

interface OnboardingState {
  // Current step
  currentStep: OnboardingStep;

  // Data
  personalInfo: PersonalInfo | null;
  username: string | null;
  professionalProfile: ProfessionalProfile | null;
  experiences: Experience[];
  noExperience: boolean;
  education: Education[];
  noEducation: boolean;
  skills: Skill[];
  noSkills: boolean;
  languages: Language[];
  templateSelection: TemplateSelection | null;

  // Step completion tracking
  completedSteps: OnboardingStep[];

  // Validation errors per step
  stepErrors: Partial<Record<OnboardingStep, string[]>>;

  // Actions
  setCurrentStep: (step: OnboardingStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Data setters
  setPersonalInfo: (data: PersonalInfo) => void;
  setUsername: (username: string | null) => void;
  setProfessionalProfile: (data: ProfessionalProfile) => void;
  setExperiences: (data: Experience[]) => void;
  setNoExperience: (value: boolean) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (id: string) => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  setEducation: (data: Education[]) => void;
  setNoEducation: (value: boolean) => void;
  addEducation: (edu: Education) => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  setSkills: (data: Skill[]) => void;
  setNoSkills: (value: boolean) => void;
  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  setLanguages: (data: Language[]) => void;
  addLanguage: (lang: Language) => void;
  removeLanguage: (id: string) => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  setTemplateSelection: (data: TemplateSelection) => void;

  // Step management
  markStepComplete: (step: OnboardingStep) => void;
  setStepErrors: (step: OnboardingStep, errors: string[]) => void;
  clearStepErrors: (step: OnboardingStep) => void;

  // Utils
  canProceed: () => boolean;
  getProgress: () => number;
  reset: () => void;

  // Build submission payload
  buildSubmissionPayload: () => SubmitOnboardingDto;

  // Sync with backend
  hydrateFromBackend: (data: {
    currentStep: OnboardingStep;
    completedSteps: OnboardingStep[];
    personalInfo: PersonalInfo | null;
    username: string | null;
    professionalProfile: ProfessionalProfile | null;
    experiences: Experience[];
    noExperience: boolean;
    education: Education[];
    noEducation: boolean;
    skills: Skill[];
    noSkills: boolean;
    languages: Language[];
    templateSelection: TemplateSelection | null;
  }) => void;

  // Get current state for backend save
  getStateForBackend: () => {
    currentStep: OnboardingStep;
    completedSteps: OnboardingStep[];
    personalInfo: PersonalInfo | null;
    username: string | null;
    professionalProfile: ProfessionalProfile | null;
    experiences: Experience[];
    noExperience: boolean;
    education: Education[];
    noEducation: boolean;
    skills: Skill[];
    noSkills: boolean;
    languages: Language[];
    templateSelection: TemplateSelection | null;
  };
}

const getStepIndex = (step: OnboardingStep): number => {
  return ONBOARDING_STEPS.findIndex((s) => s.id === step);
};

const initialState = {
  currentStep: "welcome" as OnboardingStep,
  personalInfo: null,
  username: null,
  professionalProfile: null,
  experiences: [],
  noExperience: false,
  education: [],
  noEducation: false,
  skills: [],
  noSkills: false,
  languages: [],
  templateSelection: null,
  completedSteps: [],
  stepErrors: {},
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentStep: (step) => set({ currentStep: step }),

      goToNextStep: () => {
        const { currentStep, completedSteps } = get();
        const currentIndex = getStepIndex(currentStep);

        if (currentIndex === -1) {
          console.warn("Current step not found in ONBOARDING_STEPS:", currentStep);
          return;
        }

        const nextStep = ONBOARDING_STEPS[currentIndex + 1];

        if (nextStep) {
          // Mark current as complete if not already
          if (!completedSteps.includes(currentStep)) {
            set({
              completedSteps: [...completedSteps, currentStep],
              currentStep: nextStep.id,
            });
          } else {
            set({ currentStep: nextStep.id });
          }
        }
      },

      goToPreviousStep: () => {
        const { currentStep } = get();
        const currentIndex = getStepIndex(currentStep);
        const prevStep = ONBOARDING_STEPS[currentIndex - 1];

        if (prevStep) {
          set({ currentStep: prevStep.id });
        }
      },

      // Personal Info
      setPersonalInfo: (data) => set({ personalInfo: data }),

      // Username
      setUsername: (username) => set({ username }),

      // Professional Profile
      setProfessionalProfile: (data) => set({ professionalProfile: data }),

      // Experience
      setExperiences: (data) => set({ experiences: data }),
      setNoExperience: (value) =>
        set({ noExperience: value, experiences: value ? [] : get().experiences }),
      addExperience: (exp) => set((state) => ({ experiences: [...state.experiences, exp] })),
      removeExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter((e) => e.id !== id),
        })),
      updateExperience: (id, data) =>
        set((state) => ({
          experiences: state.experiences.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      // Education
      setEducation: (data) => set({ education: data }),
      setNoEducation: (value) =>
        set({ noEducation: value, education: value ? [] : get().education }),
      addEducation: (edu) => set((state) => ({ education: [...state.education, edu] })),
      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((e) => e.id !== id),
        })),
      updateEducation: (id, data) =>
        set((state) => ({
          education: state.education.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),

      // Skills
      setSkills: (data) => set({ skills: data }),
      setNoSkills: (value) => set({ noSkills: value, skills: value ? [] : get().skills }),
      addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),
      removeSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),
      updateSkill: (id, data) =>
        set((state) => ({
          skills: state.skills.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),

      // Languages
      setLanguages: (data) => set({ languages: data }),
      addLanguage: (lang) => set((state) => ({ languages: [...state.languages, lang] })),
      removeLanguage: (id) =>
        set((state) => ({
          languages: state.languages.filter((l) => l.id !== id),
        })),
      updateLanguage: (id, data) =>
        set((state) => ({
          languages: state.languages.map((l) => (l.id === id ? { ...l, ...data } : l)),
        })),

      // Template
      setTemplateSelection: (data) => set({ templateSelection: data }),

      // Step management
      markStepComplete: (step) => {
        const { completedSteps } = get();
        if (!completedSteps.includes(step)) {
          set({ completedSteps: [...completedSteps, step] });
        }
      },

      setStepErrors: (step, errors) =>
        set((state) => ({
          stepErrors: { ...state.stepErrors, [step]: errors },
        })),

      clearStepErrors: (step) =>
        set((state) => {
          const newErrors = { ...state.stepErrors };
          delete newErrors[step];
          return { stepErrors: newErrors };
        }),

      canProceed: () => {
        const {
          currentStep,
          personalInfo,
          username,
          professionalProfile,
          skills,
          noSkills,
          templateSelection,
        } = get();

        // TODO: Use validation schemas from @profile/contracts
        // Inline validation is architectural violation (SRP)
        switch (currentStep) {
          case "welcome":
            return true;
          case "personal-info":
            return !!personalInfo?.fullName && !!personalInfo?.email;
          case "username":
            return !!username && username.length >= 3 && username.length <= 30;
          case "professional-profile":
            return !!professionalProfile?.jobTitle && !!professionalProfile?.summary;
          case "experience":
            return true; // Optional step
          case "education":
            return true; // Optional step
          case "skills":
            return noSkills || skills.length > 0;
          case "languages":
            return true; // Optional step
          case "template":
            return !!templateSelection?.palette;
          case "review":
            return true;
          default:
            return true;
        }
      },

      getProgress: () => {
        const { currentStep } = get();
        const currentIndex = getStepIndex(currentStep);
        const totalSteps = ONBOARDING_STEPS.length - 1; // Exclude 'complete'
        return Math.round((currentIndex / totalSteps) * 100);
      },

      reset: () => set(initialState),

      buildSubmissionPayload: (): SubmitOnboardingDto => {
        const state = get();

        // Validate required fields before building payload
        if (!state.username) {
          throw new Error("Username is required to complete onboarding");
        }
        if (!state.personalInfo) {
          throw new Error("Personal information is required");
        }
        if (!state.professionalProfile) {
          throw new Error("Professional profile is required");
        }
        if (!state.templateSelection) {
          throw new Error("Template selection is required");
        }

        // Normalize empty URLs to undefined
        const normalizeUrl = (url: string | undefined): string | undefined => {
          if (!url || url.trim() === "") return undefined;
          return url;
        };

        return {
          username: state.username,
          personalInfo: state.personalInfo || null,
          professionalProfile: {
            ...state.professionalProfile,
            linkedin: normalizeUrl(state.professionalProfile.linkedin),
            github: normalizeUrl(state.professionalProfile.github),
            website: normalizeUrl(state.professionalProfile.website),
          },
          skills: state.skills.map(({ id: _id, ...s }) => s),
          noSkills: state.noSkills || false,
          experiences: state.experiences.map(({ id: _id, ...e }) => e),
          noExperience: state.noExperience || false,
          education: state.education.map(({ id: _id, ...e }) => e),
          noEducation: state.noEducation || false,
          languages: state.languages.map(({ id: _id, ...l }) => l),
          templateSelection: {
            template: state.templateSelection.template.toUpperCase(),
            palette: state.templateSelection.palette,
          },
        };
      },

      hydrateFromBackend: (data) => {
        set({
          currentStep: data.currentStep,
          completedSteps: data.completedSteps,
          personalInfo: data.personalInfo,
          username: data.username,
          professionalProfile: data.professionalProfile,
          experiences: data.experiences,
          noExperience: data.noExperience,
          education: data.education,
          noEducation: data.noEducation,
          skills: data.skills,
          noSkills: data.noSkills,
          languages: data.languages,
          templateSelection: data.templateSelection,
        });
      },

      getStateForBackend: () => {
        const state = get();
        return {
          currentStep: state.currentStep,
          completedSteps: state.completedSteps,
          personalInfo: state.personalInfo,
          username: state.username,
          professionalProfile: state.professionalProfile,
          experiences: state.experiences,
          noExperience: state.noExperience,
          education: state.education,
          noEducation: state.noEducation,
          skills: state.skills,
          noSkills: state.noSkills,
          languages: state.languages,
          templateSelection: state.templateSelection,
        };
      },
    }),
    {
      name: "profile-onboarding",
      partialize: (state) => ({
        currentStep: state.currentStep,
        personalInfo: state.personalInfo,
        username: state.username,
        professionalProfile: state.professionalProfile,
        experiences: state.experiences,
        noExperience: state.noExperience,
        education: state.education,
        noEducation: state.noEducation,
        skills: state.skills,
        noSkills: state.noSkills,
        languages: state.languages,
        templateSelection: state.templateSelection,
        completedSteps: state.completedSteps,
      }),
      // Custom storage with quota error handling
      storage: {
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            return str ? JSON.parse(str) : null;
          } catch (error) {
            console.error("Failed to read from localStorage:", error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            // Handle QuotaExceededError gracefully
            if (error instanceof Error && error.name === "QuotaExceededError") {
              console.warn("localStorage quota exceeded - clearing old data");
              try {
                // Try to clear this specific key and retry
                localStorage.removeItem(name);
                localStorage.setItem(name, JSON.stringify(value));
              } catch (retryError) {
                // If still fails, operate in memory-only mode
                console.error("localStorage unavailable - running in memory mode");
              }
            } else {
              console.error("Failed to write to localStorage:", error);
            }
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error("Failed to remove from localStorage:", error);
          }
        },
      },
    }
  )
);
