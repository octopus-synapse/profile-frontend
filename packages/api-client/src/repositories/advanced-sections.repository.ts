/**
 * Advanced Resume Sections Repository
 *
 * Handles API calls for advanced resume sections:
 * - Awards
 * - Publications
 * - Talks/Presentations
 * - Open Source Contributions
 * - Bug Bounties
 * - Hackathons
 * - Interests
 * - Achievements
 * - Recommendations
 *
 * All endpoints follow the pattern: /v1/resumes/:resumeId/{section}
 */

import type { HttpClient } from "../client";
import type {
 ResumeAward,
 CreateAwardDto,
 UpdateAwardDto,
 ResumePublication,
 CreatePublicationDto,
 UpdatePublicationDto,
 ResumeTalk,
 CreateTalkDto,
 UpdateTalkDto,
 ResumeOpenSource,
 CreateOpenSourceDto,
 UpdateOpenSourceDto,
 ResumeBugBounty,
 CreateBugBountyDto,
 UpdateBugBountyDto,
 ResumeHackathon,
 CreateHackathonDto,
 UpdateHackathonDto,
 ResumeInterest,
 CreateInterestDto,
 UpdateInterestDto,
 ResumeAchievement,
 CreateAchievementDto,
 UpdateAchievementDto,
 ResumeRecommendation,
 CreateRecommendationDto,
 UpdateRecommendationDto,
} from "../types";

const BASE_URL = "/v1/resumes";

/**
 * Generic section repository factory
 * Creates CRUD operations for any resume section
 */
function createSectionRepository<
 T extends { id: string },
 CreateDto,
 UpdateDto,
>(client: HttpClient, sectionPath: string) {
 return {
  async getAll(resumeId: string): Promise<T[]> {
   return client.get<T[]>(`${BASE_URL}/${resumeId}/${sectionPath}`);
  },

  async getById(resumeId: string, id: string): Promise<T> {
   return client.get<T>(`${BASE_URL}/${resumeId}/${sectionPath}/${id}`);
  },

  async create(resumeId: string, data: CreateDto): Promise<T> {
   return client.post<T>(`${BASE_URL}/${resumeId}/${sectionPath}`, data);
  },

  async update(resumeId: string, id: string, data: UpdateDto): Promise<T> {
   return client.patch<T>(`${BASE_URL}/${resumeId}/${sectionPath}/${id}`, data);
  },

  async delete(resumeId: string, id: string): Promise<void> {
   return client.delete(`${BASE_URL}/${resumeId}/${sectionPath}/${id}`);
  },

  async reorder(resumeId: string, order: string[]): Promise<T[]> {
   return client.patch<T[]>(`${BASE_URL}/${resumeId}/${sectionPath}/reorder`, {
    order,
   });
  },
 };
}

export function createAdvancedSectionsRepository(client: HttpClient) {
 return {
  // ============================================================================
  // Awards
  // ============================================================================
  awards: createSectionRepository<ResumeAward, CreateAwardDto, UpdateAwardDto>(
   client,
   "awards"
  ),

  // ============================================================================
  // Publications
  // ============================================================================
  publications: createSectionRepository<
   ResumePublication,
   CreatePublicationDto,
   UpdatePublicationDto
  >(client, "publications"),

  // ============================================================================
  // Talks/Presentations
  // ============================================================================
  talks: createSectionRepository<ResumeTalk, CreateTalkDto, UpdateTalkDto>(
   client,
   "talks"
  ),

  // ============================================================================
  // Open Source Contributions
  // ============================================================================
  openSource: createSectionRepository<
   ResumeOpenSource,
   CreateOpenSourceDto,
   UpdateOpenSourceDto
  >(client, "open-source"),

  // ============================================================================
  // Bug Bounties
  // ============================================================================
  bugBounties: createSectionRepository<
   ResumeBugBounty,
   CreateBugBountyDto,
   UpdateBugBountyDto
  >(client, "bug-bounties"),

  // ============================================================================
  // Hackathons
  // ============================================================================
  hackathons: createSectionRepository<
   ResumeHackathon,
   CreateHackathonDto,
   UpdateHackathonDto
  >(client, "hackathons"),

  // ============================================================================
  // Interests
  // ============================================================================
  interests: createSectionRepository<
   ResumeInterest,
   CreateInterestDto,
   UpdateInterestDto
  >(client, "interests"),

  // ============================================================================
  // Achievements
  // ============================================================================
  achievements: createSectionRepository<
   ResumeAchievement,
   CreateAchievementDto,
   UpdateAchievementDto
  >(client, "achievements"),

  // ============================================================================
  // Recommendations
  // ============================================================================
  recommendations: createSectionRepository<
   ResumeRecommendation,
   CreateRecommendationDto,
   UpdateRecommendationDto
  >(client, "recommendations"),
 };
}

export type AdvancedSectionsRepository = ReturnType<
 typeof createAdvancedSectionsRepository
>;
