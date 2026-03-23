'use client';

import { apiFetch } from '@profile/api-client';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

// ============================================================================
// Types
// ============================================================================

export interface ViewsByDay {
  date: string;
  count: number;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface ViewStats {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: ViewsByDay[];
  topSources: TrafficSource[];
}

export interface SectionBreakdown {
  section: string;
  score: number;
}

export interface AtsScore {
  score: number;
  sectionBreakdown: SectionBreakdown[];
  issues: string[];
  recommendations: string[];
}

export interface KeywordAnalysis {
  existingKeywords: string[];
  missingKeywords: string[];
  keywordDensity: number;
  warnings: string[];
  recommendations: string[];
}

export interface MatchJobResult {
  matchScore: number;
  matchDetails: Record<string, unknown>;
}

export interface DashboardOverview {
  overview: Record<string, unknown>;
  viewTrend: ViewsByDay[];
  topSources: TrafficSource[];
  keywordHealth: Record<string, unknown>;
  industryPosition: Record<string, unknown>;
}

export interface ProgressionSnapshot {
  snapshots: Record<string, unknown>[];
  trend: 'improving' | 'stable' | 'declining';
  changePercent: number;
}

// ============================================================================
// Query Key Factory
// ============================================================================

export const analyticsKeys = {
  all: (resumeId: string) => ['resumeAnalytics', resumeId] as const,
  dashboard: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'dashboard'] as const,
  views: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'views'] as const,
  atsScore: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'atsScore'] as const,
  keywords: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'keywords'] as const,
  progression: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'progression'] as const,
  benchmark: (resumeId: string) =>
    [...analyticsKeys.all(resumeId), 'benchmark'] as const,
};

// ============================================================================
// Queries
// ============================================================================

export function useResumeAnalytics(resumeId: string) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(resumeId),
    queryFn: () =>
      apiFetch.get<DashboardOverview>(
        `/api/resume-analytics/${resumeId}/dashboard`,
      ),
    staleTime: 60_000,
    enabled: !!resumeId,
  });
}

export function useViewStats(resumeId: string) {
  return useQuery({
    queryKey: analyticsKeys.views(resumeId),
    queryFn: () =>
      apiFetch.get<ViewStats>(
        `/api/resume-analytics/${resumeId}/views`,
      ),
    staleTime: 60_000,
    enabled: !!resumeId,
  });
}

export function useAtsScore(resumeId: string) {
  return useQuery({
    queryKey: analyticsKeys.atsScore(resumeId),
    queryFn: () =>
      apiFetch.get<AtsScore>(
        `/api/resume-analytics/${resumeId}/ats-score`,
      ),
    staleTime: 120_000,
    enabled: !!resumeId,
  });
}

export function useKeywordAnalysis(resumeId: string) {
  return useQuery({
    queryKey: analyticsKeys.keywords(resumeId),
    queryFn: () =>
      apiFetch.get<KeywordAnalysis>(
        `/api/resume-analytics/${resumeId}/keywords`,
      ),
    staleTime: 120_000,
    enabled: !!resumeId,
  });
}

export function useProgression(resumeId: string) {
  return useQuery({
    queryKey: analyticsKeys.progression(resumeId),
    queryFn: () =>
      apiFetch.get<ProgressionSnapshot>(
        `/api/resume-analytics/${resumeId}/progression`,
      ),
    staleTime: 120_000,
    enabled: !!resumeId,
  });
}

// ============================================================================
// Mutations
// ============================================================================

export function useMatchJob(resumeId: string) {
  return useMutation({
    mutationFn: (jobDescription: string) =>
      apiFetch.post<MatchJobResult>(
        `/api/resume-analytics/${resumeId}/match-job`,
        { jobDescription },
      ),
  });
}

export function useCreateSnapshot(resumeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch.post<Record<string, unknown>>(
        `/api/resume-analytics/${resumeId}/snapshot`,
        {},
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: analyticsKeys.progression(resumeId),
      });
      void queryClient.invalidateQueries({
        queryKey: analyticsKeys.dashboard(resumeId),
      });
    },
  });
}
