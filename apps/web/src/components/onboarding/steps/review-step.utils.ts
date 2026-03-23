type ProfessionalProfileLike =
  | {
      jobTitle?: string;
      summary?: string;
    }
  | null
  | undefined;

export function isProfessionalProfileComplete(profile: ProfessionalProfileLike): boolean {
  return Boolean(profile?.jobTitle && profile?.summary);
}

export function getProfessionalProfileSummary(profile: ProfessionalProfileLike): string | null {
  return profile?.jobTitle ?? null;
}

// --- Error parsing for onboarding submission ---

export interface OnboardingErrorDetail {
  code: string;
  field: string;
  message: string;
}

export interface ParsedOnboardingError {
  code: string;
  message: string;
  details: OnboardingErrorDetail[];
}

function parseErrorDetails(details: unknown): OnboardingErrorDetail[] {
  if (!details) return [];
  if (Array.isArray(details)) {
    return details.filter(
      (d): d is OnboardingErrorDetail =>
        d && typeof d === 'object' && 'field' in d && 'message' in d,
    );
  }
  if (typeof details === 'object') {
    const arr: OnboardingErrorDetail[] = [];
    for (const [key, val] of Object.entries(details)) {
      if (key !== 'nestError' && key !== 'path' && key !== 'method') {
        arr.push({
          code: 'FIELD_ERROR',
          field: key,
          message: typeof val === 'string' ? val : JSON.stringify(val),
        });
      }
    }
    return arr;
  }
  return [];
}

/**
 * Parse onboarding error from various response formats.
 * Backend returns: { error: { code, message, details: { ... } } }
 */
export function parseOnboardingError(err: unknown): ParsedOnboardingError | null {
  if (!err || typeof err !== 'object') return null;

  // AxiosError format: err.response?.data?.error
  const axiosData = (err as { response?: { data?: unknown } })?.response?.data;
  if (axiosData && typeof axiosData === 'object') {
    const apiError = (axiosData as { error?: unknown })?.error;
    if (apiError && typeof apiError === 'object') {
      const e = apiError as Record<string, unknown>;
      return {
        code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
        message: typeof e.message === 'string' ? e.message : 'Unknown error',
        details: parseErrorDetails(e.details),
      };
    }
  }

  // Direct error object format
  if ('error' in err && typeof (err as { error: unknown }).error === 'object') {
    const e = (err as { error: Record<string, unknown> }).error;
    return {
      code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
      message: typeof e.message === 'string' ? e.message : 'Unknown error',
      details: parseErrorDetails(e.details),
    };
  }

  // Direct format (err has code, message, details)
  if ('code' in err && 'message' in err) {
    const e = err as Record<string, unknown>;
    return {
      code: typeof e.code === 'string' ? e.code : 'UNKNOWN',
      message: typeof e.message === 'string' ? e.message : 'Unknown error',
      details: parseErrorDetails(e.details),
    };
  }

  return null;
}
