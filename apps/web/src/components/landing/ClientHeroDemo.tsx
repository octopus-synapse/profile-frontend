"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { CheckCircle2, X, Heart, Flame } from "lucide-react";
import type { TranslationKeys } from "@/locales";
import { trackEvent, AnalyticsEvent } from "@/lib/analytics";

// SSR-safe hook for reduced motion preference
function useReducedMotion(): boolean {
  const getSnapshot = () =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;
  const getServerSnapshot = () => false;
  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaQuery.addEventListener("change", callback);
    return () => mediaQuery.removeEventListener("change", callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

interface ClientHeroDemoProps {
  t: TranslationKeys;
}

interface FloatingNotification {
  id: number;
  type: "applied" | "match" | "interview";
  company: string;
}

// Job card data for swipe demo
const DEMO_JOBS = [
  { id: 1, title: "Senior Designer", company: "Spotify", location: "Remote", match: 94 },
  { id: 2, title: "Product Manager", company: "Airbnb", location: "San Francisco", match: 88 },
  { id: 3, title: "Data Scientist", company: "Netflix", location: "Los Angeles", match: 91 },
];

export function ClientHeroDemo({ t }: ClientHeroDemoProps) {
  // ATS Score Animation
  const [atsScore, setAtsScore] = useState(0);
  const [atsAnimationComplete, setAtsAnimationComplete] = useState(false);
  const atsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const atsObserverRef = useRef<IntersectionObserver | null>(null);
  const atsContainerRef = useRef<HTMLDivElement>(null);

  // Swipe Demo
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // Floating Notifications
  const [notifications, setNotifications] = useState<FloatingNotification[]>([]);
  const notificationIdRef = useRef(0);

  // Reduced Motion - using sync external store for SSR safety
  const prefersReducedMotion = useReducedMotion();

  // ATS Score Animation with Intersection Observer
  useEffect(() => {
    const container = atsContainerRef.current;
    if (!container) return;

    // For reduced motion, set score immediately via callback
    if (prefersReducedMotion) {
      const timeoutId = setTimeout(() => {
        setAtsScore(94);
        setAtsAnimationComplete(true);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    atsObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !atsAnimationComplete) {
            // Start animation
            let currentScore = 0;
            atsIntervalRef.current = setInterval(() => {
              currentScore += 2;
              if (currentScore >= 94) {
                setAtsScore(94);
                setAtsAnimationComplete(true);
                if (atsIntervalRef.current) {
                  clearInterval(atsIntervalRef.current);
                  atsIntervalRef.current = null;
                }
                // Track analytics event
                trackEvent(AnalyticsEvent.ATS_SCORE_SEEN, { score: 94 });
              } else {
                setAtsScore(currentScore);
              }
            }, 30);
          }
        });
      },
      { threshold: 0.5 }
    );

    atsObserverRef.current.observe(container);

    // Cleanup function with proper ref handling
    return () => {
      if (atsIntervalRef.current) {
        clearInterval(atsIntervalRef.current);
        atsIntervalRef.current = null;
      }
      if (atsObserverRef.current) {
        atsObserverRef.current.disconnect();
        atsObserverRef.current = null;
      }
    };
  }, [atsAnimationComplete, prefersReducedMotion]);

  // Floating notifications effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const showNotification = () => {
      const types: FloatingNotification["type"][] = ["applied", "match", "interview"];
      const companies = ["Google", "Meta", "Apple", "Amazon", "Microsoft", "Netflix"];

      const randomType = types[Math.floor(Math.random() * types.length)] ?? "applied";
      const randomCompany = companies[Math.floor(Math.random() * companies.length)] ?? "Google";

      const newNotification: FloatingNotification = {
        id: notificationIdRef.current++,
        type: randomType,
        company: randomCompany,
      };

      setNotifications((prev) => [...prev.slice(-2), newNotification]);

      // Auto-remove after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 3000);
    };

    // Initial notification
    const initialTimeout = setTimeout(showNotification, 2000);

    // Recurring notifications
    const interval = setInterval(showNotification, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [prefersReducedMotion]);

  // Swipe handlers
  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (prefersReducedMotion) {
        // Instant transition without animation
        setCurrentJobIndex((prev) => (prev + 1) % DEMO_JOBS.length);
        return;
      }

      setSwipeDirection(direction);

      // Track analytics
      const job = DEMO_JOBS[currentJobIndex]!;
      trackEvent(
        direction === "right" ? AnalyticsEvent.DEMO_SWIPE_RIGHT : AnalyticsEvent.DEMO_SWIPE_LEFT,
        { jobId: job.id, jobTitle: job.title }
      );

      // Reset after animation
      setTimeout(() => {
        setSwipeDirection(null);
        setCurrentJobIndex((prev) => (prev + 1) % DEMO_JOBS.length);
      }, 300);
    },
    [currentJobIndex, prefersReducedMotion]
  );

  // Keyboard navigation for swipe
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handleSwipe("left");
      } else if (e.key === "ArrowRight") {
        handleSwipe("right");
      }
    },
    [handleSwipe]
  );

  const currentJob = DEMO_JOBS[currentJobIndex]!;

  return (
    <div className="relative">
      {/* Floating Notifications */}
      <div
        className="absolute top-0 -right-4 z-20 space-y-2"
        aria-live="polite"
        aria-label="Job application notifications"
      >
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A0A0A]/90 p-3 text-sm shadow-lg ${prefersReducedMotion ? "" : "animate-slide-in-right"} `}
            style={{
              animationDelay: prefersReducedMotion ? "0ms" : `${index * 100}ms`,
              opacity: prefersReducedMotion ? 1 : undefined,
            }}
            role="status"
          >
            {notification.type === "applied" && (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                <span>
                  Applied to <strong>{notification.company}</strong>
                </span>
              </>
            )}
            {notification.type === "match" && (
              <>
                <Heart className="h-4 w-4 text-red-500" aria-hidden="true" />
                <span>
                  <strong>{notification.company}</strong> matched!
                </span>
              </>
            )}
            {notification.type === "interview" && (
              <>
                <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span>
                  Interview at <strong>{notification.company}</strong>
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main Demo Card */}
      <div
        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]/80 shadow-2xl"
        role="region"
        aria-label="Job matching demo"
      >
        {/* ATS Score Section */}
        <div
          ref={atsContainerRef}
          className="border-b border-white/10 p-6"
          aria-label={`ATS Score: ${atsScore}%`}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-400">ATS Score</span>
            <span
              className={`text-2xl font-bold transition-colors duration-300 ${
                atsScore >= 90
                  ? "text-emerald-500"
                  : atsScore >= 70
                    ? "text-amber-500"
                    : "text-red-500"
              }`}
              aria-live="polite"
            >
              {atsScore}%
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-white/5"
            role="progressbar"
            aria-valuenow={atsScore}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                atsScore >= 90 ? "bg-emerald-500" : atsScore >= 70 ? "bg-amber-500" : "bg-red-500"
              }`}
              style={{ width: `${atsScore}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            {atsScore >= 90 ? "✓ Your resume passes ATS screening!" : "Optimizing..."}
          </p>
        </div>

        {/* Swipe Demo Section */}
        <div
          className="p-6"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="application"
          aria-label="Job card. Use left and right arrow keys to swipe"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{t.swipe.tinderTitle}</h3>
            <span className="text-sm text-zinc-500">
              {currentJobIndex + 1}/{DEMO_JOBS.length}
            </span>
          </div>

          {/* Job Card */}
          <div
            className={`relative mb-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 p-4 ${!prefersReducedMotion ? "transition-transform duration-300" : ""} ${swipeDirection === "left" ? "-translate-x-full opacity-0" : ""} ${swipeDirection === "right" ? "translate-x-full opacity-0" : ""} `}
          >
            {/* Match Badge */}
            <div className="absolute -top-2 -right-2 rounded-full bg-emerald-500 px-2 py-1 text-xs font-bold text-white">
              {currentJob.match}% {t.swipe.matchScore}
            </div>

            <h4 className="text-lg font-bold">{currentJob.title}</h4>
            <p className="text-zinc-400">{currentJob.company}</p>
            <p className="text-sm text-zinc-500">{currentJob.location}</p>
          </div>

          {/* Swipe Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSwipe("left")}
              className="rounded-full bg-red-500/10 p-4 text-red-500 transition-colors hover:bg-red-500/20"
              aria-label={t.swipe.swipeLeft}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              onClick={() => handleSwipe("right")}
              className="rounded-full bg-emerald-500/10 p-4 text-emerald-500 transition-colors hover:bg-emerald-500/20"
              aria-label={t.swipe.swipeRight}
            >
              <Heart className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Keyboard hint */}
          <p className="mt-3 text-center text-xs text-zinc-500">
            <kbd className="rounded bg-white/5 px-1 py-0.5 text-xs">←</kbd> {t.swipe.swipeLeft} ·{" "}
            <kbd className="rounded bg-white/5 px-1 py-0.5 text-xs">→</kbd> {t.swipe.swipeRight}
          </p>
        </div>
      </div>
    </div>
  );
}
