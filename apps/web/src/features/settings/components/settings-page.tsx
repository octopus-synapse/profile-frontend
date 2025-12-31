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
import { ProfileSection } from "./profile-section";
import { ExperiencesSection } from "./experiences-section";
import { EducationSection } from "./education-section";
import { SkillsSection } from "./skills-section";
import { LanguagesSection } from "./languages-section";
import { PreferencesSection } from "./preferences-section";

type SettingsTab =
  | "profile"
  | "experiences"
  | "education"
  | "skills"
  | "languages"
  | "preferences";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "experiences", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "preferences", label: "Preferences", icon: Settings },
];

export function SettingsPage() {
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/protected"
          className="text-pf-fg-muted hover:text-pf-fg-default mb-4 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to Dashboard
        </Link>
        <h1 className="text-pf-fg-default mt-6 text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-pf-fg-muted mt-2 text-base">
          Manage your profile, career information, and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-pf-border-default border-b">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === id
                  ? "border-pf-fg-default text-pf-fg-default"
                  : "border-transparent text-pf-fg-muted hover:text-pf-fg-default hover:border-pf-border-emphasis"
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">{renderContent()}</div>
    </div>
  );
}
