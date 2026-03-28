/**
 * ATS Score Utilities - Pure UI functions for score display
 */

export type ScoreLevel = 'good' | 'fair' | 'poor';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 75) return 'good';
  if (score >= 50) return 'fair';
  return 'poor';
}

export function getScoreTextColor(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return 'text-emerald-400';
    case 'fair':
      return 'text-amber-400';
    case 'poor':
      return 'text-red-400';
  }
}

export function getScoreContainerClasses(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return 'border-emerald-500/20 bg-emerald-500/5';
    case 'fair':
      return 'border-amber-500/20 bg-amber-500/5';
    case 'poor':
      return 'border-red-500/20 bg-red-500/5';
  }
}

export function getScoreBadgeVariant(score: number): 'success' | 'warning' | 'error' {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return 'success';
    case 'fair':
      return 'warning';
    case 'poor':
      return 'error';
  }
}

export function getScoreGaugeColor(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return '#10b981'; // emerald-500
    case 'fair':
      return '#f59e0b'; // amber-500
    case 'poor':
      return '#ef4444'; // red-500
  }
}

export function getScoreBarColor(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return 'bg-emerald-500';
    case 'fair':
      return 'bg-amber-500';
    case 'poor':
      return 'bg-red-500';
  }
}

export function getScoreLabel(score: number): string {
  const level = getScoreLevel(score);
  switch (level) {
    case 'good':
      return 'Excellent';
    case 'fair':
      return 'Needs Work';
    case 'poor':
      return 'Poor';
  }
}

export function getSeverityIconColor(severity: string): string {
  switch (severity) {
    case 'error':
      return '#ef4444'; // red-500
    case 'warning':
      return '#f59e0b'; // amber-500
    case 'info':
      return '#06b6d4'; // cyan-500
    default:
      return '#71717a'; // zinc-500
  }
}

export interface AtsIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  field?: string;
  category?: string;
}

export interface AtsValidationResult {
  score: number;
  issues: AtsIssue[];
  suggestions: string[];
  metadata: {
    semanticScore?: number;
    [key: string]: unknown;
  };
}
