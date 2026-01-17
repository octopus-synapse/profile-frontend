/**
 * Resume Factory
 * Creates mock resume entities for testing
 */

export interface ResumeSection {
 id: string;
 type: string;
 title: string;
 content: unknown;
 order: number;
 isVisible: boolean;
}

export interface ResumeFactoryOptions {
 id?: string;
 userId?: string;
 title?: string;
 slug?: string;
 summary?: string;
 isPublic?: boolean;
 isDefault?: boolean;
 themeId?: string;
 sections?: ResumeSection[];
 createdAt?: Date;
 updatedAt?: Date;
}

export interface MockResume {
 id: string;
 userId: string;
 title: string;
 slug: string;
 summary: string | null;
 isPublic: boolean;
 isDefault: boolean;
 themeId: string | null;
 sections: ResumeSection[];
 createdAt: Date;
 updatedAt: Date;
}

let resumeIdCounter = 1;

/**
 * Create a mock resume with sensible defaults
 */
export function createResume(options: ResumeFactoryOptions = {}): MockResume {
 const id = options.id ?? `resume-${resumeIdCounter++}`;
 const now = new Date();

 return {
  id,
  userId: options.userId ?? "user-1",
  title: options.title ?? "My Resume",
  slug: options.slug ?? `resume-${id}`,
  summary: options.summary ?? null,
  isPublic: options.isPublic ?? false,
  isDefault: options.isDefault ?? false,
  themeId: options.themeId ?? null,
  sections: options.sections ?? [],
  createdAt: options.createdAt ?? now,
  updatedAt: options.updatedAt ?? now,
 };
}

/**
 * Create a public resume
 */
export function createPublicResume(
 options: Omit<ResumeFactoryOptions, "isPublic"> = {}
): MockResume {
 return createResume({ ...options, isPublic: true });
}

/**
 * Create a default resume
 */
export function createDefaultResume(
 options: Omit<ResumeFactoryOptions, "isDefault"> = {}
): MockResume {
 return createResume({ ...options, isDefault: true });
}

/**
 * Create a resume with sections
 */
export function createResumeWithSections(
 sectionCount: number,
 options: Omit<ResumeFactoryOptions, "sections"> = {}
): MockResume {
 const sections: ResumeSection[] = Array.from(
  { length: sectionCount },
  (_, i) => ({
   id: `section-${i + 1}`,
   type: i % 2 === 0 ? "experience" : "education",
   title: `Section ${i + 1}`,
   content: {},
   order: i,
   isVisible: true,
  })
 );

 return createResume({ ...options, sections });
}

/**
 * Create multiple resumes
 */
export function createResumes(
 count: number,
 options: ResumeFactoryOptions = {}
): MockResume[] {
 return Array.from({ length: count }, () => createResume(options));
}

/**
 * Reset the resume ID counter (use in beforeEach for consistent IDs)
 */
export function resetResumeFactory(): void {
 resumeIdCounter = 1;
}
