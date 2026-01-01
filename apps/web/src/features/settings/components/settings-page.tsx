/**
 * Settings Page
 * Clean, minimalist settings page for all tech professionals
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Languages,
  Settings,
} from "lucide-react";
import { useI18n } from "@/features/i18n";
import type { DictionaryKey } from "@/features/i18n/dictionaries/en";
import { ProfileSection } from "./profile-section";
import { ExperiencesSection } from "./experiences-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { LanguagesSection } from "./languages-section";
import { PreferencesSection } from "./preferences-section";

type SettingsTab = "profile" | "experiences" | "education" | "skills" | "languages" | "preferences";

const TABS: { id: SettingsTab; labelKey: DictionaryKey; icon: typeof User }[] = [
  { id: "profile", labelKey: "app.settings.tabs.profile", icon: User },
  { id: "experiences", labelKey: "app.settings.tabs.experience", icon: Briefcase },
  { id: "education", labelKey: "app.settings.tabs.education", icon: GraduationCap },
  { id: "skills", labelKey: "app.settings.tabs.skills", icon: Sparkles },
  { id: "languages", labelKey: "app.settings.tabs.languages", icon: Languages },
  { id: "preferences", labelKey: "app.settings.tabs.preferences", icon: Settings },
];

export function SettingsPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection />;
      case "experiences":
        return <ExperiencesSection />;
      case "education":
        return <EducationSection />;
      case "skills":
        return <SkillsSection />;
      case "languages":
        return <LanguagesSection />;
      case "preferences":
        return <PreferencesSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
      {/* Header */}
      <div>
        <Link
          href="/protected"
          className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          {t("app.settings.backToDashboard")}
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white">
          {t("app.settings.title")}
        </h1>
        <p className="mt-2 text-base text-zinc-500">{t("app.settings.description")}</p>
      </div>

      {/* Tab Navigation */}
      <div className="relative border-b border-white/10">
        {/* Scroll fade indicators */}
        <div className="pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-8 bg-gradient-to-l from-[var(--pf-canvas-default)] to-transparent md:hidden" />
        <nav className="scrollbar-none -mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-mono text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pf-canvas-default)] focus-visible:outline-none ${
                activeTab === id
                  ? "border-cyan-500 text-white"
                  : "border-transparent text-zinc-500 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {t(labelKey)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
}
