/**
 * Resume Configuration Types
 * Frontend UI types for resume theme and configuration.
 */

export interface ThemeColors {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string | { primary?: string; secondary?: string };
  accent?: string;
  muted?: string;
  [key: string]: string | Record<string, string> | undefined;
}

export interface ThemeStyleConfig {
  colors?: ThemeColors;
  fonts?: Record<string, string>;
  spacing?: Record<string, string | number>;
  tokens?: {
    colors?: ThemeColors;
    fonts?: Record<string, string>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Alias for backward compatibility
export type ResumeStyleConfig = ThemeStyleConfig;

export type ThemeStatus = 'PUBLISHED' | 'PRIVATE' | 'PENDING_APPROVAL' | 'REJECTED';
export type ThemeCategory =
  | 'PROFESSIONAL'
  | 'CREATIVE'
  | 'TECHNICAL'
  | 'ACADEMIC'
  | 'MINIMAL'
  | 'MODERN'
  | 'CLASSIC'
  | 'EXECUTIVE';

export interface Theme {
  id: string;
  name: string;
  description?: string | null;
  styleConfig: ThemeStyleConfig;
  isPublic: boolean;
  isDefault: boolean;
  isSystemTheme?: boolean;
  status?: ThemeStatus;
  category?: ThemeCategory;
  tags?: string[];
  authorId: string;
  author?: {
    id: string;
    name?: string;
    email?: string;
  };
  parentThemeId?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  styleConfig: ThemeStyleConfig;
}
