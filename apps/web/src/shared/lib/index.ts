/**
 * Shared lib barrel export
 */

export * from "./api-client";

// Legacy http-client export for gradual migration
// TODO: Remove after full migration to @profile/api-client
export * from "./http-client";
