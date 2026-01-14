/**
 * Analytics Repository
 * Handles resume analytics and share analytics
 */

import type { HttpClient } from "../client";

export interface ResumeAnalytics {
 resumeId: string;
 views: number;
 downloads: number;
 shares: number;
 lastViewedAt: Date | null;
 createdAt: Date;
 updatedAt: Date;
}

export interface ShareAnalytics {
 shareId: string;
 totalViews: number;
 uniqueVisitors: number;
 downloads: number;
 topReferrers: Array<{ referer: string; count: number }>;
 viewsByDate: Array<{ date: string; count: number }>;
 lastViewedAt: Date | null;
}

export interface AnalyticsTimeRange {
 startDate?: string | Date;
 endDate?: string | Date;
}

export function createAnalyticsRepository(client: HttpClient) {
 return {
  /**
   * Get resume analytics
   */
  async getResumeAnalytics(resumeId: string): Promise<ResumeAnalytics> {
   return client.get<ResumeAnalytics>(`/v1/analytics/resumes/${resumeId}`);
  },

  /**
   * Get share link analytics
   */
  async getShareAnalytics(
   shareId: string,
   timeRange?: AnalyticsTimeRange
  ): Promise<ShareAnalytics> {
   const params: Record<string, string> = {};
   if (timeRange?.startDate) {
    params.startDate =
     timeRange.startDate instanceof Date
      ? timeRange.startDate.toISOString()
      : timeRange.startDate;
   }
   if (timeRange?.endDate) {
    params.endDate =
     timeRange.endDate instanceof Date
      ? timeRange.endDate.toISOString()
      : timeRange.endDate;
   }

   return client.get<ShareAnalytics>(`/v1/analytics/shares/${shareId}`, {
    params,
   });
  },

  /**
   * Get all user analytics summary
   */
  async getUserAnalyticsSummary(): Promise<{
   totalViews: number;
   totalDownloads: number;
   totalShares: number;
   mostViewedResume: { id: string; title: string; views: number } | null;
  }> {
   return client.get("/v1/analytics/summary");
  },
 };
}

export type AnalyticsRepository = ReturnType<typeof createAnalyticsRepository>;
