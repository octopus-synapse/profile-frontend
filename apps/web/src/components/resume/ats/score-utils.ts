/**
 * Score threshold utilities for ATS scoring components.
 *
 * Why: the pattern `score >= 75 ? X : score >= 50 ? Y : Z`
 * was duplicated across 4+ files with different color formats.
 */

const SCORE_GOOD = 75;
const SCORE_FAIR = 50;

type ScoreLevel = 'good' | 'fair' | 'poor';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= SCORE_GOOD) return 'good';
  if (score >= SCORE_FAIR) return 'fair';
  return 'poor';
}

/** Hex color for SVG gauge strokes */
export function getScoreGaugeColor(score: number): string {
  const colors: Record<ScoreLevel, string> = {
    good: '#22c55e',
    fair: '#f59e0b',
    poor: '#ef4444',
  };
  return colors[getScoreLevel(score)];
}

/** Tailwind background class for progress bars */
export function getScoreBarColor(score: number): string {
  const colors: Record<ScoreLevel, string> = {
    good: 'bg-emerald-500',
    fair: 'bg-amber-500',
    poor: 'bg-red-500',
  };
  return colors[getScoreLevel(score)];
}

/** Badge variant for score display */
export function getScoreBadgeVariant(score: number): 'success' | 'warning' | 'error' {
  const variants: Record<ScoreLevel, 'success' | 'warning' | 'error'> = {
    good: 'success',
    fair: 'warning',
    poor: 'error',
  };
  return variants[getScoreLevel(score)];
}

/** Human-readable label for score level */
export function getScoreLabel(score: number): string {
  const labels: Record<ScoreLevel, string> = {
    good: 'Good',
    fair: 'Fair',
    poor: 'Low',
  };
  return labels[getScoreLevel(score)];
}

/** Tailwind text color class for score values */
export function getScoreTextColor(score: number): string {
  const colors: Record<ScoreLevel, string> = {
    good: 'text-emerald-400',
    fair: 'text-amber-400',
    poor: 'text-red-400',
  };
  return colors[getScoreLevel(score)];
}

/** Tailwind background + border classes for score containers */
export function getScoreContainerClasses(score: number): string {
  const classes: Record<ScoreLevel, string> = {
    good: 'bg-emerald-500/10 border-emerald-500/20',
    fair: 'bg-amber-500/10 border-amber-500/20',
    poor: 'bg-red-500/10 border-red-500/20',
  };
  return classes[getScoreLevel(score)];
}
