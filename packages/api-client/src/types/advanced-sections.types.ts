/**
 * Advanced Resume Section Types
 * API types for advanced resume section operations
 *
 * These types map to the profile-services endpoints for:
 * - Awards
 * - Publications
 * - Talks
 * - Open Source Contributions
 * - Bug Bounties
 * - Hackathons
 * - Interests
 * - Achievements
 * - Recommendations
 */

// ============================================================================
// Enums (match profile-contracts)
// ============================================================================

export type AchievementType =
 | "CERTIFICATION_BADGE"
 | "PERFORMANCE_AWARD"
 | "GAMIFICATION_BADGE"
 | "MILESTONE"
 | "RECOGNITION"
 | "LEADERBOARD"
 | "OTHER";

export type SeverityLevel =
 | "CRITICAL"
 | "HIGH"
 | "MEDIUM"
 | "LOW"
 | "INFORMATIONAL";

export type OpenSourceRole =
 | "MAINTAINER"
 | "CORE_CONTRIBUTOR"
 | "CONTRIBUTOR"
 | "REVIEWER"
 | "DOCUMENTATION"
 | "TRANSLATOR"
 | "OTHER";

export type PublicationType =
 | "JOURNAL_ARTICLE"
 | "CONFERENCE_PAPER"
 | "BOOK"
 | "BOOK_CHAPTER"
 | "THESIS"
 | "WHITEPAPER"
 | "BLOG_POST"
 | "TECHNICAL_REPORT"
 | "OTHER";

export type EventType =
 | "CONFERENCE"
 | "MEETUP"
 | "WORKSHOP"
 | "WEBINAR"
 | "PODCAST"
 | "INTERNAL"
 | "UNIVERSITY"
 | "OTHER";

// ============================================================================
// Response Types (Persisted Entities)
// ============================================================================

export interface ResumeAward {
 id: string;
 resumeId: string;
 title: string;
 issuer: string;
 date: string;
 description: string | null;
 url: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumePublication {
 id: string;
 resumeId: string;
 title: string;
 publisher: string;
 publicationType: PublicationType;
 url: string | null;
 publishedAt: string;
 abstract: string | null;
 coAuthors: string[];
 citations: number | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeTalk {
 id: string;
 resumeId: string;
 title: string;
 event: string;
 eventType: EventType;
 location: string | null;
 date: string;
 description: string | null;
 slidesUrl: string | null;
 videoUrl: string | null;
 attendees: number | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeOpenSource {
 id: string;
 resumeId: string;
 projectName: string;
 projectUrl: string;
 role: OpenSourceRole;
 description: string | null;
 technologies: string[];
 commits: number | null;
 prsCreated: number | null;
 prsMerged: number | null;
 issuesClosed: number | null;
 stars: number | null;
 startDate: string;
 endDate: string | null;
 isCurrent: boolean;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeBugBounty {
 id: string;
 resumeId: string;
 platform: string;
 company: string;
 severity: SeverityLevel;
 vulnerabilityType: string;
 cveId: string | null;
 reward: number | null;
 currency: string;
 reportUrl: string | null;
 reportedAt: string;
 resolvedAt: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeHackathon {
 id: string;
 resumeId: string;
 name: string;
 organizer: string;
 date: string;
 location: string | null;
 projectName: string;
 projectDescription: string | null;
 projectUrl: string | null;
 position: string | null;
 teamSize: number | null;
 technologies: string[];
 prize: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeInterest {
 id: string;
 resumeId: string;
 name: string;
 category: string | null;
 description: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeAchievement {
 id: string;
 resumeId: string;
 type: AchievementType;
 title: string;
 description: string | null;
 badgeUrl: string | null;
 verificationUrl: string | null;
 achievedAt: string;
 value: number | null;
 rank: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

export interface ResumeRecommendation {
 id: string;
 resumeId: string;
 author: string;
 position: string | null;
 company: string | null;
 content: string;
 date: string | null;
 order: number;
 createdAt: string;
 updatedAt: string;
}

// ============================================================================
// Create DTOs
// ============================================================================

export interface CreateAwardDto {
 title: string;
 issuer: string;
 date: string;
 description?: string;
 url?: string;
 order?: number;
}

export interface CreatePublicationDto {
 title: string;
 publisher: string;
 publicationType: PublicationType;
 url?: string;
 publishedAt: string;
 abstract?: string;
 coAuthors?: string[];
 citations?: number;
 order?: number;
}

export interface CreateTalkDto {
 title: string;
 event: string;
 eventType: EventType;
 location?: string;
 date: string;
 description?: string;
 slidesUrl?: string;
 videoUrl?: string;
 attendees?: number;
 order?: number;
}

export interface CreateOpenSourceDto {
 projectName: string;
 projectUrl: string;
 role: OpenSourceRole;
 description?: string;
 technologies?: string[];
 commits?: number;
 prsCreated?: number;
 prsMerged?: number;
 issuesClosed?: number;
 stars?: number;
 startDate: string;
 endDate?: string;
 isCurrent?: boolean;
 order?: number;
}

export interface CreateBugBountyDto {
 platform: string;
 company: string;
 severity: SeverityLevel;
 vulnerabilityType: string;
 cveId?: string;
 reward?: number;
 currency?: string;
 reportUrl?: string;
 reportedAt: string;
 resolvedAt?: string;
 order?: number;
}

export interface CreateHackathonDto {
 name: string;
 organizer: string;
 date: string;
 location?: string;
 projectName: string;
 projectDescription?: string;
 projectUrl?: string;
 position?: string;
 teamSize?: number;
 technologies?: string[];
 prize?: string;
 order?: number;
}

export interface CreateInterestDto {
 name: string;
 category?: string;
 description?: string;
 order?: number;
}

export interface CreateAchievementDto {
 type: AchievementType;
 title: string;
 description?: string;
 badgeUrl?: string;
 verificationUrl?: string;
 achievedAt: string;
 value?: number;
 rank?: string;
 order?: number;
}

export interface CreateRecommendationDto {
 author: string;
 position?: string;
 company?: string;
 content: string;
 date?: string;
 order?: number;
}

// ============================================================================
// Update DTOs (Partial of Create)
// ============================================================================

export type UpdateAwardDto = Partial<CreateAwardDto>;
export type UpdatePublicationDto = Partial<CreatePublicationDto>;
export type UpdateTalkDto = Partial<CreateTalkDto>;
export type UpdateOpenSourceDto = Partial<CreateOpenSourceDto>;
export type UpdateBugBountyDto = Partial<CreateBugBountyDto>;
export type UpdateHackathonDto = Partial<CreateHackathonDto>;
export type UpdateInterestDto = Partial<CreateInterestDto>;
export type UpdateAchievementDto = Partial<CreateAchievementDto>;
export type UpdateRecommendationDto = Partial<CreateRecommendationDto>;
