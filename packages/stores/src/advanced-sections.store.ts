/**
 * Advanced Resume Sections Store
 *
 * Manages state for advanced resume sections with Zustand.
 * Handles: Awards, Publications, Talks, Open Source, Bug Bounties,
 * Hackathons, Interests, Achievements, and Recommendations.
 */

import { create } from "zustand";
import type { ProfileApiClient } from "@profile/api-client";
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
} from "@profile/api-client";

// ============================================================================
// Types
// ============================================================================

export interface AdvancedSectionsState {
 resumeId: string | null;
 awards: ResumeAward[];
 publications: ResumePublication[];
 talks: ResumeTalk[];
 openSource: ResumeOpenSource[];
 bugBounties: ResumeBugBounty[];
 hackathons: ResumeHackathon[];
 interests: ResumeInterest[];
 achievements: ResumeAchievement[];
 recommendations: ResumeRecommendation[];
 isLoading: boolean;
 error: string | null;
}

export interface AdvancedSectionsActions {
 // State management
 setResumeId: (resumeId: string | null) => void;
 setLoading: (loading: boolean) => void;
 setError: (error: string | null) => void;
 clearError: () => void;
 resetState: () => void;

 // Fetch all sections for a resume
 fetchAllSections: (resumeId: string) => Promise<void>;

 // Awards
 fetchAwards: (resumeId: string) => Promise<void>;
 addAward: (resumeId: string, data: CreateAwardDto) => Promise<ResumeAward>;
 updateAward: (
  resumeId: string,
  id: string,
  data: UpdateAwardDto
 ) => Promise<ResumeAward>;
 deleteAward: (resumeId: string, id: string) => Promise<void>;
 reorderAwards: (resumeId: string, order: string[]) => Promise<void>;

 // Publications
 fetchPublications: (resumeId: string) => Promise<void>;
 addPublication: (
  resumeId: string,
  data: CreatePublicationDto
 ) => Promise<ResumePublication>;
 updatePublication: (
  resumeId: string,
  id: string,
  data: UpdatePublicationDto
 ) => Promise<ResumePublication>;
 deletePublication: (resumeId: string, id: string) => Promise<void>;
 reorderPublications: (resumeId: string, order: string[]) => Promise<void>;

 // Talks
 fetchTalks: (resumeId: string) => Promise<void>;
 addTalk: (resumeId: string, data: CreateTalkDto) => Promise<ResumeTalk>;
 updateTalk: (
  resumeId: string,
  id: string,
  data: UpdateTalkDto
 ) => Promise<ResumeTalk>;
 deleteTalk: (resumeId: string, id: string) => Promise<void>;
 reorderTalks: (resumeId: string, order: string[]) => Promise<void>;

 // Open Source
 fetchOpenSource: (resumeId: string) => Promise<void>;
 addOpenSource: (
  resumeId: string,
  data: CreateOpenSourceDto
 ) => Promise<ResumeOpenSource>;
 updateOpenSource: (
  resumeId: string,
  id: string,
  data: UpdateOpenSourceDto
 ) => Promise<ResumeOpenSource>;
 deleteOpenSource: (resumeId: string, id: string) => Promise<void>;
 reorderOpenSource: (resumeId: string, order: string[]) => Promise<void>;

 // Bug Bounties
 fetchBugBounties: (resumeId: string) => Promise<void>;
 addBugBounty: (
  resumeId: string,
  data: CreateBugBountyDto
 ) => Promise<ResumeBugBounty>;
 updateBugBounty: (
  resumeId: string,
  id: string,
  data: UpdateBugBountyDto
 ) => Promise<ResumeBugBounty>;
 deleteBugBounty: (resumeId: string, id: string) => Promise<void>;
 reorderBugBounties: (resumeId: string, order: string[]) => Promise<void>;

 // Hackathons
 fetchHackathons: (resumeId: string) => Promise<void>;
 addHackathon: (
  resumeId: string,
  data: CreateHackathonDto
 ) => Promise<ResumeHackathon>;
 updateHackathon: (
  resumeId: string,
  id: string,
  data: UpdateHackathonDto
 ) => Promise<ResumeHackathon>;
 deleteHackathon: (resumeId: string, id: string) => Promise<void>;
 reorderHackathons: (resumeId: string, order: string[]) => Promise<void>;

 // Interests
 fetchInterests: (resumeId: string) => Promise<void>;
 addInterest: (
  resumeId: string,
  data: CreateInterestDto
 ) => Promise<ResumeInterest>;
 updateInterest: (
  resumeId: string,
  id: string,
  data: UpdateInterestDto
 ) => Promise<ResumeInterest>;
 deleteInterest: (resumeId: string, id: string) => Promise<void>;
 reorderInterests: (resumeId: string, order: string[]) => Promise<void>;

 // Achievements
 fetchAchievements: (resumeId: string) => Promise<void>;
 addAchievement: (
  resumeId: string,
  data: CreateAchievementDto
 ) => Promise<ResumeAchievement>;
 updateAchievement: (
  resumeId: string,
  id: string,
  data: UpdateAchievementDto
 ) => Promise<ResumeAchievement>;
 deleteAchievement: (resumeId: string, id: string) => Promise<void>;
 reorderAchievements: (resumeId: string, order: string[]) => Promise<void>;

 // Recommendations
 fetchRecommendations: (resumeId: string) => Promise<void>;
 addRecommendation: (
  resumeId: string,
  data: CreateRecommendationDto
 ) => Promise<ResumeRecommendation>;
 updateRecommendation: (
  resumeId: string,
  id: string,
  data: UpdateRecommendationDto
 ) => Promise<ResumeRecommendation>;
 deleteRecommendation: (resumeId: string, id: string) => Promise<void>;
 reorderRecommendations: (resumeId: string, order: string[]) => Promise<void>;
}

export type AdvancedSectionsStore = AdvancedSectionsState &
 AdvancedSectionsActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: AdvancedSectionsState = {
 resumeId: null,
 awards: [],
 publications: [],
 talks: [],
 openSource: [],
 bugBounties: [],
 hackathons: [],
 interests: [],
 achievements: [],
 recommendations: [],
 isLoading: false,
 error: null,
};

// ============================================================================
// Store Factory
// ============================================================================

export const createAdvancedSectionsStore = (apiClient: ProfileApiClient) =>
 create<AdvancedSectionsStore>((set, _get) => ({
  ...initialState,

  // ========================================================================
  // State Management
  // ========================================================================

  setResumeId: (resumeId) => set({ resumeId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  resetState: () => set(initialState),

  // ========================================================================
  // Fetch All Sections
  // ========================================================================

  fetchAllSections: async (resumeId) => {
   set({ isLoading: true, error: null, resumeId });
   try {
    const [
     awards,
     publications,
     talks,
     openSource,
     bugBounties,
     hackathons,
     interests,
     achievements,
     recommendations,
    ] = await Promise.all([
     apiClient.advancedSections.awards.getAll(resumeId),
     apiClient.advancedSections.publications.getAll(resumeId),
     apiClient.advancedSections.talks.getAll(resumeId),
     apiClient.advancedSections.openSource.getAll(resumeId),
     apiClient.advancedSections.bugBounties.getAll(resumeId),
     apiClient.advancedSections.hackathons.getAll(resumeId),
     apiClient.advancedSections.interests.getAll(resumeId),
     apiClient.advancedSections.achievements.getAll(resumeId),
     apiClient.advancedSections.recommendations.getAll(resumeId),
    ]);
    set({
     awards,
     publications,
     talks,
     openSource,
     bugBounties,
     hackathons,
     interests,
     achievements,
     recommendations,
     isLoading: false,
    });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch advanced sections";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Awards
  // ========================================================================

  fetchAwards: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const awards = await apiClient.advancedSections.awards.getAll(resumeId);
    set({ awards, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch awards";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addAward: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const award = await apiClient.advancedSections.awards.create(
     resumeId,
     data
    );
    set((state) => ({
     awards: [...state.awards, award],
     isLoading: false,
    }));
    return award;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add award";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateAward: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.awards.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     awards: state.awards.map((a) => (a.id === id ? updated : a)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update award";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteAward: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.awards.delete(resumeId, id);
    set((state) => ({
     awards: state.awards.filter((a) => a.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete award";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderAwards: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const awards = await apiClient.advancedSections.awards.reorder(
     resumeId,
     order
    );
    set({ awards, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder awards";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Publications
  // ========================================================================

  fetchPublications: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const publications =
     await apiClient.advancedSections.publications.getAll(resumeId);
    set({ publications, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch publications";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addPublication: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const publication = await apiClient.advancedSections.publications.create(
     resumeId,
     data
    );
    set((state) => ({
     publications: [...state.publications, publication],
     isLoading: false,
    }));
    return publication;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add publication";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updatePublication: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.publications.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     publications: state.publications.map((p) => (p.id === id ? updated : p)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update publication";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deletePublication: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.publications.delete(resumeId, id);
    set((state) => ({
     publications: state.publications.filter((p) => p.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete publication";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderPublications: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const publications = await apiClient.advancedSections.publications.reorder(
     resumeId,
     order
    );
    set({ publications, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder publications";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Talks
  // ========================================================================

  fetchTalks: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const talks = await apiClient.advancedSections.talks.getAll(resumeId);
    set({ talks, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch talks";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addTalk: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const talk = await apiClient.advancedSections.talks.create(resumeId, data);
    set((state) => ({
     talks: [...state.talks, talk],
     isLoading: false,
    }));
    return talk;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add talk";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateTalk: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.talks.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     talks: state.talks.map((t) => (t.id === id ? updated : t)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update talk";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteTalk: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.talks.delete(resumeId, id);
    set((state) => ({
     talks: state.talks.filter((t) => t.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete talk";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderTalks: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const talks = await apiClient.advancedSections.talks.reorder(
     resumeId,
     order
    );
    set({ talks, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder talks";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Open Source
  // ========================================================================

  fetchOpenSource: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const openSource =
     await apiClient.advancedSections.openSource.getAll(resumeId);
    set({ openSource, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to fetch open source contributions";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addOpenSource: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const item = await apiClient.advancedSections.openSource.create(
     resumeId,
     data
    );
    set((state) => ({
     openSource: [...state.openSource, item],
     isLoading: false,
    }));
    return item;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to add open source contribution";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateOpenSource: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.openSource.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     openSource: state.openSource.map((o) => (o.id === id ? updated : o)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to update open source contribution";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteOpenSource: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.openSource.delete(resumeId, id);
    set((state) => ({
     openSource: state.openSource.filter((o) => o.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to delete open source contribution";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderOpenSource: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const openSource = await apiClient.advancedSections.openSource.reorder(
     resumeId,
     order
    );
    set({ openSource, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to reorder open source contributions";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Bug Bounties
  // ========================================================================

  fetchBugBounties: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const bugBounties =
     await apiClient.advancedSections.bugBounties.getAll(resumeId);
    set({ bugBounties, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch bug bounties";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addBugBounty: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const bugBounty = await apiClient.advancedSections.bugBounties.create(
     resumeId,
     data
    );
    set((state) => ({
     bugBounties: [...state.bugBounties, bugBounty],
     isLoading: false,
    }));
    return bugBounty;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add bug bounty";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateBugBounty: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.bugBounties.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     bugBounties: state.bugBounties.map((b) => (b.id === id ? updated : b)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update bug bounty";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteBugBounty: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.bugBounties.delete(resumeId, id);
    set((state) => ({
     bugBounties: state.bugBounties.filter((b) => b.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete bug bounty";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderBugBounties: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const bugBounties = await apiClient.advancedSections.bugBounties.reorder(
     resumeId,
     order
    );
    set({ bugBounties, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder bug bounties";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Hackathons
  // ========================================================================

  fetchHackathons: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const hackathons =
     await apiClient.advancedSections.hackathons.getAll(resumeId);
    set({ hackathons, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch hackathons";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addHackathon: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const hackathon = await apiClient.advancedSections.hackathons.create(
     resumeId,
     data
    );
    set((state) => ({
     hackathons: [...state.hackathons, hackathon],
     isLoading: false,
    }));
    return hackathon;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add hackathon";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateHackathon: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.hackathons.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     hackathons: state.hackathons.map((h) => (h.id === id ? updated : h)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update hackathon";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteHackathon: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.hackathons.delete(resumeId, id);
    set((state) => ({
     hackathons: state.hackathons.filter((h) => h.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete hackathon";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderHackathons: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const hackathons = await apiClient.advancedSections.hackathons.reorder(
     resumeId,
     order
    );
    set({ hackathons, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder hackathons";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Interests
  // ========================================================================

  fetchInterests: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const interests =
     await apiClient.advancedSections.interests.getAll(resumeId);
    set({ interests, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch interests";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addInterest: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const interest = await apiClient.advancedSections.interests.create(
     resumeId,
     data
    );
    set((state) => ({
     interests: [...state.interests, interest],
     isLoading: false,
    }));
    return interest;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add interest";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateInterest: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.interests.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     interests: state.interests.map((i) => (i.id === id ? updated : i)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update interest";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteInterest: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.interests.delete(resumeId, id);
    set((state) => ({
     interests: state.interests.filter((i) => i.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete interest";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderInterests: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const interests = await apiClient.advancedSections.interests.reorder(
     resumeId,
     order
    );
    set({ interests, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder interests";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Achievements
  // ========================================================================

  fetchAchievements: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const achievements =
     await apiClient.advancedSections.achievements.getAll(resumeId);
    set({ achievements, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch achievements";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addAchievement: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const achievement = await apiClient.advancedSections.achievements.create(
     resumeId,
     data
    );
    set((state) => ({
     achievements: [...state.achievements, achievement],
     isLoading: false,
    }));
    return achievement;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add achievement";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateAchievement: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.achievements.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     achievements: state.achievements.map((a) => (a.id === id ? updated : a)),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update achievement";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteAchievement: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.achievements.delete(resumeId, id);
    set((state) => ({
     achievements: state.achievements.filter((a) => a.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete achievement";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderAchievements: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const achievements = await apiClient.advancedSections.achievements.reorder(
     resumeId,
     order
    );
    set({ achievements, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to reorder achievements";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  // ========================================================================
  // Recommendations
  // ========================================================================

  fetchRecommendations: async (resumeId) => {
   set({ isLoading: true, error: null });
   try {
    const recommendations =
     await apiClient.advancedSections.recommendations.getAll(resumeId);
    set({ recommendations, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to fetch recommendations";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  addRecommendation: async (resumeId, data) => {
   set({ isLoading: true, error: null });
   try {
    const recommendation =
     await apiClient.advancedSections.recommendations.create(resumeId, data);
    set((state) => ({
     recommendations: [...state.recommendations, recommendation],
     isLoading: false,
    }));
    return recommendation;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to add recommendation";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  updateRecommendation: async (resumeId, id, data) => {
   set({ isLoading: true, error: null });
   try {
    const updated = await apiClient.advancedSections.recommendations.update(
     resumeId,
     id,
     data
    );
    set((state) => ({
     recommendations: state.recommendations.map((r) =>
      r.id === id ? updated : r
     ),
     isLoading: false,
    }));
    return updated;
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to update recommendation";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  deleteRecommendation: async (resumeId, id) => {
   set({ isLoading: true, error: null });
   try {
    await apiClient.advancedSections.recommendations.delete(resumeId, id);
    set((state) => ({
     recommendations: state.recommendations.filter((r) => r.id !== id),
     isLoading: false,
    }));
   } catch (error) {
    const message =
     error instanceof Error ? error.message : "Failed to delete recommendation";
    set({ error: message, isLoading: false });
    throw error;
   }
  },

  reorderRecommendations: async (resumeId, order) => {
   set({ isLoading: true, error: null });
   try {
    const recommendations =
     await apiClient.advancedSections.recommendations.reorder(resumeId, order);
    set({ recommendations, isLoading: false });
   } catch (error) {
    const message =
     error instanceof Error
      ? error.message
      : "Failed to reorder recommendations";
    set({ error: message, isLoading: false });
    throw error;
   }
  },
 }));
