type ProfessionalProfileLike = {
  jobTitle?: string;
  summary?: string;
} | null;

export function isProfessionalProfileComplete(profile: ProfessionalProfileLike): boolean {
  return Boolean(profile?.jobTitle && profile?.summary);
}

export function getProfessionalProfileSummary(profile: ProfessionalProfileLike): string | null {
  return profile?.jobTitle ?? null;
}
