/**
 * Settings Types
 * Types for user profile, preferences, and resume data management
 */

// User Profile
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  displayName: string | null;
  username: string | null;
  usernameUpdatedAt: string | null;
  photoURL: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  location?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

// User Preferences
export interface UserPreferences {
  theme?: "light" | "dark" | "system";
  language?: string;
  profileVisibility?: "public" | "private";
  emailNotifications?: boolean;
}

// Resume Data Types (matching backend)
export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  location?: string | null;
  order?: number;
}

export interface CreateExperiencePayload {
  company: string;
  position: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  location?: string | null;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string | null;
  order?: number;
}

export interface CreateEducationPayload {
  institution: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: number;
  order?: number;
}

export interface CreateSkillPayload {
  name: string;
  category: string;
  level?: number;
}

export interface Language {
  id: string;
  name: string;
  level: "basic" | "intermediate" | "advanced" | "fluent" | "native";
  cefrLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null;
  order?: number;
}

export interface CreateLanguagePayload {
  name: string;
  level: "basic" | "intermediate" | "advanced" | "fluent" | "native";
  cefrLevel?: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null;
}

// Resume Info
export interface ResumeInfo {
  id: string;
  userId: string;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Spoken Languages Catalog (pre-populated list of languages)
export interface SpokenLanguageCatalog {
  code: string;
  nameEn: string;
  namePtBr: string;
  nameEs: string;
  nativeName: string | null;
}
