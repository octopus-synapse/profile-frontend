export interface Resume {
  id: string
  userId: string
  title: string
  templateId?: string
  colorScheme?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string

  // Relations
  experiences?: Experience[]
  education?: Education[]
  skills?: Skill[]
  languages?: Language[]
  projects?: Project[]
  certifications?: Certification[]
  awards?: Award[]
  interests?: string[]
}

export interface Experience {
  id: string
  resumeId: string
  company: string
  position: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
  location?: string
  type?: string
  order: number
}

export interface Education {
  id: string
  resumeId: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate?: string
  current: boolean
  gpa?: string
  description?: string
  location?: string
  order: number
}

export interface Skill {
  id: string
  resumeId: string
  name: string
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category?: string
  order: number
}

export interface Language {
  id: string
  resumeId: string
  name: string
  proficiency: string
  order: number
}

export interface Project {
  id: string
  resumeId: string
  name: string
  description?: string
  url?: string
  startDate?: string
  endDate?: string
  technologies?: string[]
  order: number
}

export interface Certification {
  id: string
  resumeId: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  url?: string
  order: number
}

export interface Award {
  id: string
  resumeId: string
  title: string
  issuer: string
  date: string
  description?: string
  order: number
}

export interface CreateResumeRequest {
  title: string
  templateId?: string
  colorScheme?: string
  isPublic?: boolean
}

export interface UpdateResumeRequest {
  title?: string
  templateId?: string
  colorScheme?: string
  isPublic?: boolean
}

export interface ResumeListResponse {
  resumes: Resume[]
  total: number
}

export interface ResumeDetailResponse {
  resume: Resume
}
