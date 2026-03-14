'use client';

import { Briefcase, DollarSign, Heart, MapPin, Star, TrendingUp, X } from 'lucide-react';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import type { TranslationKeys } from '@/locales';

// SSR-safe hook for reduced motion preference
function useReducedMotion(): boolean {
  const getSnapshot = () =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  const getServerSnapshot = () => false;
  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface SwipeModeDemoProps {
  t: TranslationKeys;
}

// Enhanced job data with more details
const DEMO_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Spotify',
    location: 'Remote',
    salary: '$150k - $200k',
    match: 94,
    color: '#1DB954',
    skills: ['React', 'TypeScript', 'Next.js'],
    type: 'Full-time',
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Airbnb',
    location: 'San Francisco',
    salary: '$170k - $220k',
    match: 88,
    color: '#FF5A5F',
    skills: ['Strategy', 'Analytics', 'UX'],
    type: 'Full-time',
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Angeles',
    salary: '$180k - $250k',
    match: 91,
    color: '#E50914',
    skills: ['Python', 'ML', 'SQL'],
    type: 'Full-time',
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Stripe',
    location: 'Remote',
    salary: '$160k - $210k',
    match: 85,
    color: '#635BFF',
    skills: ['AWS', 'Docker', 'K8s'],
    type: 'Full-time',
  },
  {
    id: 5,
    title: 'UX Designer',
    company: 'Figma',
    location: 'New York',
    salary: '$140k - $180k',
    match: 92,
    color: '#A259FF',
    skills: ['Figma', 'Research', 'Prototyping'],
    type: 'Full-time',
  },
];

interface ActionFeedback {
  type: 'applied' | 'skipped';
  company: string;
}

export function SwipeModeDemo({ t }: SwipeModeDemoProps) {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback | null>(null);
  const [appliedCount, setAppliedCount] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const currentJob = DEMO_JOBS[currentJobIndex % DEMO_JOBS.length];

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (swipeDirection) return; // Prevent double swipes

      if (prefersReducedMotion) {
        if (direction === 'right' && currentJob) {
          setAppliedCount((prev) => prev + 1);
        }
        setCurrentJobIndex((prev) => (prev + 1) % DEMO_JOBS.length);
        return;
      }

      setSwipeDirection(direction);

      if (direction === 'right' && currentJob) {
        setAppliedCount((prev) => prev + 1);
        setActionFeedback({ type: 'applied', company: currentJob.company });
      } else if (currentJob) {
        setActionFeedback({ type: 'skipped', company: currentJob.company });
      }

      // Reset after animation
      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentJobIndex((prev) => (prev + 1) % DEMO_JOBS.length);

        // Clear feedback after a delay
        setTimeout(() => setActionFeedback(null), 500);
      }, 400);
    },
    [currentJob, swipeDirection, prefersReducedMotion],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  if (!currentJob) return null;

  return (
    <div className="relative mx-auto max-w-md">
      {/* Action Feedback Toast */}
      {actionFeedback && (
        <div
          className={`animate-notification-in absolute -top-16 left-1/2 z-20 -translate-x-1/2 rounded-full px-6 py-2 text-sm font-medium shadow-lg ${
            actionFeedback.type === 'applied'
              ? 'bg-emerald-500 text-white'
              : 'bg-zinc-500 text-white'
          }`}
        >
          {actionFeedback.type === 'applied' ? (
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-current" />
              Applied to {actionFeedback.company}!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Skipped {actionFeedback.company}
            </span>
          )}
        </div>
      )}

      {/* Stats Bar */}
      <div className="mb-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-zinc-400">
            <span className="font-semibold text-white">{appliedCount}</span> applied today
          </span>
        </div>
        <div className="text-xs text-zinc-500">
          {currentJobIndex + 1} of {DEMO_JOBS.length}
        </div>
      </div>

      {/* Job Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-xl transition-all duration-300 ${
          swipeDirection === 'left' ? 'animate-swipe-left' : ''
        } ${swipeDirection === 'right' ? 'animate-swipe-right' : ''}`}
        role="article"
        aria-label={`Job: ${currentJob.title} at ${currentJob.company}`}
      >
        {/* Match Badge */}
        <div
          className="absolute top-4 right-4 z-10 rounded-full px-3 py-1.5 text-sm font-bold text-white shadow-lg"
          style={{ backgroundColor: currentJob.color }}
        >
          {currentJob.match}% {t.swipe?.matchScore || 'match'}
        </div>

        {/* Company Header */}
        <div
          className="relative h-24"
          style={{
            background: `linear-gradient(135deg, ${currentJob.color}20, ${currentJob.color}40)`,
          }}
        >
          <div
            className="absolute bottom-0 left-6 flex h-16 w-16 translate-y-1/2 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg"
            style={{ backgroundColor: currentJob.color }}
          >
            {currentJob.company.charAt(0)}
          </div>
        </div>

        {/* Job Details */}
        <div className="px-6 pt-12 pb-6">
          <h3 className="text-xl font-bold text-white">{currentJob.title}</h3>
          <p className="mt-1 font-medium text-zinc-400">{currentJob.company}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <MapPin className="h-4 w-4" />
              {currentJob.location}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <DollarSign className="h-4 w-4" />
              {currentJob.salary}
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Briefcase className="h-4 w-4" />
              {currentJob.type}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {currentJob.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Match Breakdown */}
          <div className="mt-4 rounded-lg bg-white/5 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Your match</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(currentJob.match / 20)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Buttons */}
      <div className="mt-6 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => handleSwipe('left')}
          className="group flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-500 bg-red-500/10 text-red-500 shadow-lg transition-all hover:scale-110 hover:border-red-500 hover:bg-red-500 hover:text-white"
          aria-label={t.swipe?.swipeLeft || 'Skip'}
        >
          <X className="h-7 w-7" />
        </button>

        <button
          type="button"
          onClick={() => handleSwipe('right')}
          className="group animate-pulse-scale flex h-20 w-20 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500 shadow-lg transition-all hover:scale-110 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white"
          aria-label={t.swipe?.swipeRight || 'Apply'}
        >
          <Heart className="h-8 w-8" />
        </button>
      </div>

      {/* Keyboard Hint */}
      <p className="mt-4 text-center text-xs text-zinc-500">
        <kbd className="rounded bg-white/5 px-2 py-0.5">←</kbd> {t.swipe?.swipeLeft || 'Skip'} ·{' '}
        <kbd className="rounded bg-white/5 px-2 py-0.5">→</kbd> {t.swipe?.swipeRight || 'Apply'}
      </p>
    </div>
  );
}

// Match Score Visualization Component
export function MatchScoreVisual({
  score,
  size = 'md',
}: {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = {
    sm: { circle: 60, stroke: 6, text: 'text-lg' },
    md: { circle: 80, stroke: 8, text: 'text-2xl' },
    lg: { circle: 120, stroke: 10, text: 'text-4xl' },
  };

  const { circle, stroke, text } = sizes[size];
  const radius = (circle - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return 'var(--pf-success-fg)';
    if (s >= 70) return 'var(--pf-attention-fg)';
    return 'var(--pf-danger-fg)';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={circle} height={circle} className="-rotate-90">
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          fill="none"
          stroke="var(--pf-border-muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={circle / 2}
          cy={circle / 2}
          r={radius}
          fill="none"
          stroke={getColor(score)}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="animate-circle-fill"
          style={{ '--final-offset': offset } as React.CSSProperties}
        />
      </svg>
      <span className={`absolute font-bold ${text}`} style={{ color: getColor(score) }}>
        {score}%
      </span>
    </div>
  );
}
