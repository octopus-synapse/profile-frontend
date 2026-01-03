/**
 * Onboarding Test Factories
 * Uncle Bob: "Tests should be deterministic and explicit"
 *
 * Simple factory functions for creating test data.
 * No randomization, no magic - just plain objects with sensible defaults.
 */

import type {
  PersonalInfo,
  ProfessionalProfile,
  Experience,
  Education,
  Skill,
  Language,
  TemplateSelection,
  OnboardingStep,
} from "@/features/onboarding/stores/onboarding-store";
import type { OnboardingProgress } from "@/features/onboarding/services/onboarding-repository";
import type { SubmitOnboardingDto } from "@/features/onboarding/types";

/**
 * Creates a mock PersonalInfo object
 */
export function createMockPersonalInfo(
  overrides?: Partial<PersonalInfo>
): PersonalInfo {
  return {
    fullName: "João Silva",
    email: "joao.silva@example.com",
    phone: "+55 11 98765-4321",
    location: "São Paulo, SP",
    ...overrides,
  };
}

/**
 * Creates a mock ProfessionalProfile object
 */
export function createMockProfessionalProfile(
  overrides?: Partial<ProfessionalProfile>
): ProfessionalProfile {
  return {
    jobTitle: "Software Engineer",
    summary: "Experienced software engineer with focus on web development.",
    linkedin: "https://linkedin.com/in/joaosilva",
    github: "https://github.com/joaosilva",
    website: "https://joaosilva.dev",
    ...overrides,
  };
}

/**
 * Creates a mock Experience object
 */
export function createMockExperience(
  overrides?: Partial<Experience>
): Experience {
  return {
    id: "exp-1",
    company: "Tech Corp",
    position: "Software Engineer",
    startDate: "2020-01",
    endDate: "2023-12",
    isCurrent: false,
    description: "Developed web applications using React and Node.js",
    location: "São Paulo, SP",
    ...overrides,
  };
}

/**
 * Creates a mock Education object
 */
export function createMockEducation(overrides?: Partial<Education>): Education {
  return {
    id: "edu-1",
    institution: "Universidade de São Paulo",
    degree: "Bacharel",
    field: "Ciência da Computação",
    startDate: "2016-01",
    endDate: "2019-12",
    isCurrent: false,
    ...overrides,
  };
}

/**
 * Creates a mock Skill object
 */
export function createMockSkill(overrides?: Partial<Skill>): Skill {
  return {
    id: "skill-1",
    name: "React",
    category: "Frontend",
    level: 4,
    ...overrides,
  };
}

/**
 * Creates a mock Language object
 */
export function createMockLanguage(overrides?: Partial<Language>): Language {
  return {
    id: "lang-1",
    name: "Português",
    level: "nativo",
    ...overrides,
  };
}

/**
 * Creates a mock TemplateSelection object
 */
export function createMockTemplateSelection(
  overrides?: Partial<TemplateSelection>
): TemplateSelection {
  return {
    template: "professional",
    palette: "blue",
    ...overrides,
  };
}

/**
 * Creates a mock OnboardingProgress object
 * Uncle Bob: "Provide sensible defaults, allow explicit overrides"
 */
export function createMockOnboardingProgress(
  overrides?: Partial<OnboardingProgress>
): OnboardingProgress {
  return {
    currentStep: "personal-info" as OnboardingStep,
    completedSteps: ["welcome"] as OnboardingStep[],
    username: null,
    personalInfo: null,
    professionalProfile: null,
    experiences: [],
    noExperience: false,
    education: [],
    noEducation: false,
    skills: [],
    noSkills: false,
    languages: [],
    templateSelection: null,
    ...overrides,
  };
}

/**
 * Creates a complete OnboardingProgress with all data filled
 * Useful for testing the final review step
 */
export function createCompleteOnboardingProgress(
  overrides?: Partial<OnboardingProgress>
): OnboardingProgress {
  return {
    currentStep: "review" as OnboardingStep,
    completedSteps: [
      "welcome",
      "personal-info",
      "username",
      "professional-profile",
      "experience",
      "education",
      "skills",
      "languages",
      "template",
    ] as OnboardingStep[],
    username: "joaosilva",
    personalInfo: createMockPersonalInfo(),
    professionalProfile: createMockProfessionalProfile(),
    experiences: [createMockExperience()],
    noExperience: false,
    education: [createMockEducation()],
    noEducation: false,
    skills: [
      createMockSkill({ id: "skill-1", name: "React", category: "Frontend" }),
      createMockSkill({ id: "skill-2", name: "TypeScript", category: "Language" }),
    ],
    noSkills: false,
    languages: [
      createMockLanguage({ id: "lang-1", name: "Português", level: "nativo" }),
      createMockLanguage({ id: "lang-2", name: "Inglês", level: "fluente" }),
    ],
    templateSelection: createMockTemplateSelection(),
    ...overrides,
  };
}

/**
 * Creates a mock SubmitOnboardingDto object
 * This is the final payload sent to the backend
 */
export function createMockSubmitOnboardingDto(
  overrides?: Partial<SubmitOnboardingDto>
): SubmitOnboardingDto {
  return {
    username: "joaosilva",
    personalInfo: {
      fullName: "João Silva",
      email: "joao.silva@example.com",
      phone: "+55 11 98765-4321",
      location: "São Paulo, SP",
    },
    professionalProfile: {
      jobTitle: "Software Engineer",
      summary: "Experienced software engineer with focus on web development.",
      linkedin: "https://linkedin.com/in/joaosilva",
      github: "https://github.com/joaosilva",
      website: "https://joaosilva.dev",
    },
    skillsStep: {
      skills: [
        { name: "React", category: "Frontend", level: 4 },
        { name: "TypeScript", category: "Language", level: 4 },
      ],
      noSkills: false,
    },
    experiencesStep: {
      experiences: [
        {
          company: "Tech Corp",
          position: "Software Engineer",
          startDate: "2020-01",
          endDate: "2023-12",
          isCurrent: false,
          description: "Developed web applications using React and Node.js",
          location: "São Paulo, SP",
        },
      ],
      noExperience: false,
    },
    educationStep: {
      education: [
        {
          institution: "Universidade de São Paulo",
          degree: "Bacharel",
          field: "Ciência da Computação",
          startDate: "2016-01",
          endDate: "2019-12",
          isCurrent: false,
        },
      ],
      noEducation: false,
    },
    languages: [
      { name: "Português", level: "nativo" },
      { name: "Inglês", level: "fluente" },
    ],
    templateSelection: {
      template: "professional",
      palette: "blue",
    },
    ...overrides,
  };
}

/**
 * Creates a minimal SubmitOnboardingDto with only required fields
 * Useful for testing edge cases
 */
export function createMinimalSubmitOnboardingDto(
  overrides?: Partial<SubmitOnboardingDto>
): SubmitOnboardingDto {
  return {
    username: "joaosilva",
    personalInfo: {
      fullName: "João Silva",
      email: "joao.silva@example.com",
    },
    professionalProfile: {
      jobTitle: "Software Engineer",
      summary: "Experienced software engineer.",
    },
    skillsStep: {
      skills: [{ name: "React", category: "Frontend" }],
      noSkills: false,
    },
    templateSelection: {
      template: "professional",
      palette: "blue",
    },
    ...overrides,
  };
}
