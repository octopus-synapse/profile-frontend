/**
 * Application constants
 * Centralized configuration values
 */

// ============================================================================
// Application Info
// ============================================================================

export const APP = {
 NAME: "ProFile",
 DESCRIPTION: "Professional developer profiles and resumes",
 VERSION: "2.0.0",
} as const;

// ============================================================================
// API Configuration
// ============================================================================

export const API = {
 TIMEOUT: 30000, // 30 seconds
 RETRY_ATTEMPTS: 3,
 RETRY_DELAY: 1000, // 1 second
} as const;

// ============================================================================
// Authentication
// ============================================================================

export const AUTH = {
 SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
 TOKEN_REFRESH_THRESHOLD: 5 * 60, // 5 minutes in seconds
} as const;

// ============================================================================
// Pagination
// ============================================================================

export const PAGINATION = {
 DEFAULT_PAGE_SIZE: 10,
 MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// Validation
// ============================================================================

export const VALIDATION = {
 USERNAME: {
  MIN_LENGTH: 3,
  MAX_LENGTH: 30,
  PATTERN: /^[a-z0-9_-]+$/i,
 },
 PASSWORD: {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
 },
 BIO: {
  MAX_LENGTH: 500,
 },
 RESUME: {
  TITLE_MAX_LENGTH: 100,
  SUMMARY_MAX_LENGTH: 2000,
 },
} as const;

// ============================================================================
// Theme
// ============================================================================

export const THEME = {
 DEFAULT: "dark" as const,
 OPTIONS: ["light", "dark", "system"] as const,
} as const;

// ============================================================================
// Supported Languages
// ============================================================================

export const LANGUAGES = {
  DEFAULT: "en" as const,
  SUPPORTED: ["en", "pt-BR", "es"] as const,
} as const;

export type SupportedLanguage = (typeof LANGUAGES.SUPPORTED)[number];
