/**
 * Resume Services - Barrel Export
 *
 * Note: resumeRepository, themeRepository, and sectionConfigRepository have been removed.
 * Use apiClient.resumes, apiClient.themes, and apiClient.sectionConfig instead.
 * This ensures web and mobile share the same implementation via @profile/api-client.
 */

export * from "./theme.types";
