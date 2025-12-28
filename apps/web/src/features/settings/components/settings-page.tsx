/**
 * Settings Page
 * Main settings page with tabbed navigation
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Code,
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
  { id: "profile", label: "profile", icon: User },
  { id: "experiences", label: "experiences", icon: Briefcase },
  { id: "education", label: "education", icon: GraduationCap },
  { id: "skills", label: "skills", icon: Code },
  { id: "languages", label: "languages", icon: Languages },
  { id: "preferences", label: "preferences", icon: Settings },
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
          className="text-pf-fg-muted hover:text-pf-fg-default mb-4 inline-flex items-center gap-2 font-mono text-xs transition-colors"
        >
          <ArrowLeft className="h-3 w-3" strokeWidth={1.5} />
          back_to_dashboard
        </Link>
        <div className="mt-4 flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">// Settings</span>
        </div>
        <h1 className="text-pf-fg-default mt-2 text-3xl font-bold">
          configure<span className="text-pf-fg-muted font-normal">()</span>
        </h1>
        <p className="text-pf-fg-muted mt-2 font-mono text-sm">
          Manage your profile, data, and preferences
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-pf-border-default border-b">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 font-mono text-sm transition-colors ${
                activeTab === id
                  ? "border-pf-accent-fg text-pf-accent-fg"
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

      {/* Terminal Footer */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/profile/settings</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">profile config --get {activeTab}</span>
          </div>
          <div className="terminal-output mt-2">
            <div className="text-pf-fg-muted">
              Viewing <span className="text-pf-accent-fg">{activeTab}</span> settings
            </div>
            <div className="text-pf-fg-subtle mt-1">
              Use the tabs above to navigate between different settings sections.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
