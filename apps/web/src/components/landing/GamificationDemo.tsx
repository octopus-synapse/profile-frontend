"use client";

import { useEffect, useState, useRef, useSyncExternalStore } from "react";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Star,
  Award,
  Calendar,
  CheckCircle2,
  Medal,
} from "lucide-react";
import type { TranslationKeys } from "@/locales";

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

interface GamificationDemoProps {
  t: TranslationKeys;
}

export function GamificationDemo({ t }: GamificationDemoProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Target}
          label={t.gamification?.progress || "Profile Strength"}
          value={85}
          suffix="%"
          color="accent"
          isVisible={isVisible}
          prefersReducedMotion={prefersReducedMotion}
          delay={0}
        />
        <StatCard
          icon={Zap}
          label={t.gamification?.applications || "Applications Sent"}
          value={127}
          color="attention"
          isVisible={isVisible}
          prefersReducedMotion={prefersReducedMotion}
          delay={100}
        />
        <StatCard
          icon={Calendar}
          label={t.gamification?.interviews || "Interviews Scheduled"}
          value={12}
          color="success"
          isVisible={isVisible}
          prefersReducedMotion={prefersReducedMotion}
          delay={200}
        />
        <StatCard
          icon={Trophy}
          label={t.gamification?.badges || "Achievements"}
          value={8}
          color="done"
          isVisible={isVisible}
          prefersReducedMotion={prefersReducedMotion}
          delay={300}
        />
      </div>

      {/* Streak Section */}
      <StreakDisplay t={t} isVisible={isVisible} prefersReducedMotion={prefersReducedMotion} />

      {/* Achievements Row */}
      <AchievementBadges isVisible={isVisible} prefersReducedMotion={prefersReducedMotion} />
    </div>
  );
}

// Animated Stat Card
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  suffix?: string;
  color: "accent" | "success" | "attention" | "done";
  isVisible: boolean;
  prefersReducedMotion: boolean;
  delay: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix = "",
  color,
  isVisible,
  prefersReducedMotion,
  delay,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    if (prefersReducedMotion) {
      queueMicrotask(() => setDisplayValue(value));
      return;
    }

    const timeout = setTimeout(() => {
      let current = 0;
      const increment = value / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isVisible, value, prefersReducedMotion, delay]);

  const colorClasses = {
    accent: { bg: "bg-cyan-500/10", text: "text-cyan-400", icon: "text-cyan-400" },
    success: { bg: "bg-emerald-500/10", text: "text-emerald-500", icon: "text-emerald-500" },
    attention: {
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      icon: "text-amber-500",
    },
    done: { bg: "bg-purple-500/10", text: "text-purple-500", icon: "text-purple-500" },
  };

  const colors = colorClasses[color];

  return (
    <div className="hero-feature-card rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-5 transition-all hover:shadow-lg">
      <div className={`mb-3 inline-flex rounded-lg p-2.5 ${colors.bg}`}>
        <Icon className={`h-5 w-5 ${colors.icon}`} />
      </div>
      <div className={`text-3xl font-bold ${colors.text}`}>
        {displayValue}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-zinc-400">{label}</div>
    </div>
  );
}

// Streak Display Component
function StreakDisplay({
  t,
  isVisible,
  prefersReducedMotion,
}: {
  t: TranslationKeys;
  isVisible: boolean;
  prefersReducedMotion: boolean;
}) {
  const days = [
    { day: "M", active: true },
    { day: "T", active: true },
    { day: "W", active: true },
    { day: "T", active: true },
    { day: "F", active: true },
    { day: "S", active: true },
    { day: "S", active: true },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/10">
            <Flame className="animate-bounce-gentle h-7 w-7 text-amber-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {t.gamification?.streakTitle || "You're on fire!"}
            </h3>
            <p className="text-sm text-zinc-400">
              {t.gamification?.streakDescription || "7-day application streak"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {days.map((d, index) => (
            <div
              key={index}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                isVisible && !prefersReducedMotion
                  ? `animate-stagger-${Math.min(index + 1, 6)}`
                  : ""
              } ${d.active ? "bg-amber-500 text-white" : "bg-white/5 text-zinc-500"}`}
            >
              {d.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Achievement Badges Component
const ACHIEVEMENTS = [
  { icon: Star, label: "First Application", color: "#FFD700", earned: true },
  { icon: Zap, label: "Speed Demon", color: "#FF6B6B", earned: true },
  { icon: Target, label: "Perfect Match", color: "#4ECDC4", earned: true },
  { icon: Trophy, label: "Interview Pro", color: "#9B59B6", earned: true },
  { icon: Medal, label: "Top Candidate", color: "#3498DB", earned: true },
  { icon: Award, label: "Career Champion", color: "#E74C3C", earned: false },
];

function AchievementBadges({
  isVisible,
  prefersReducedMotion,
}: {
  isVisible: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {ACHIEVEMENTS.map((achievement, index) => {
        const Icon = achievement.icon;
        return (
          <div
            key={achievement.label}
            className={`group relative flex flex-col items-center gap-2 rounded-xl p-3 transition-all ${
              isVisible && !prefersReducedMotion ? `animate-stagger-${Math.min(index + 1, 6)}` : ""
            } ${
              achievement.earned
                ? "border border-white/10 bg-[#0A0A0A]/80 hover:shadow-lg"
                : "bg-white/5 opacity-50"
            }`}
            title={achievement.label}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${
                achievement.earned ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: achievement.earned ? achievement.color + "20" : undefined,
              }}
            >
              <Icon
                className="h-6 w-6"
                style={{ color: achievement.earned ? achievement.color : "#71717a" }}
              />
            </div>
            {achievement.earned && (
              <CheckCircle2 className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#0A0A0A] text-emerald-500" />
            )}
            <span className="hidden text-center text-[10px] leading-tight text-zinc-400 sm:block">
              {achievement.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Progress Ring Component
export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 8,
  color = "accent",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: "accent" | "success" | "attention" | "done";
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const colorValues = {
    accent: "#22d3ee",
    success: "#10b981",
    attention: "#f59e0b",
    done: "#a855f7",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colorValues[color]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span className="absolute text-lg font-bold" style={{ color: colorValues[color] }}>
        {progress}%
      </span>
    </div>
  );
}
