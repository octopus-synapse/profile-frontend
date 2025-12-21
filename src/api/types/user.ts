export interface User {
  id: string
  name: string
  email: string
  username?: string
  image?: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  id: string
  userId: string
  theme: 'light' | 'dark' | 'system'
  language: string
  emailNotifications: boolean
  profileVisibility: 'public' | 'private' | 'unlisted'
  createdAt: string
  updatedAt: string
}

export interface UpdateUserRequest {
  name?: string
  username?: string
  bio?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  image?: string
}

export interface UpdatePreferencesRequest {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  emailNotifications?: boolean
  profileVisibility?: 'public' | 'private' | 'unlisted'
}

export interface UserProfileResponse {
  user: User
  preferences: UserPreferences
}
