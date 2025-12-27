/**
 * Skills Step
 *
 * Nielsen: Recognition rather than recall (predefined categories & skills)
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Skill } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, X, Zap } from "lucide-react";
import { nanoid } from "nanoid";

// Predefined skill categories and common skills
const SKILL_CATEGORIES = {
  "Programming Languages": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "Go",
    "Rust",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Kotlin",
  ],
  Frontend: [
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Svelte",
    "Tailwind CSS",
    "HTML/CSS",
    "SASS",
    "Redux",
    "React Query",
  ],
  Backend: [
    "Node.js",
    "Express",
    "NestJS",
    "Django",
    "FastAPI",
    "Spring Boot",
    "Laravel",
    ".NET",
    "Rails",
    "GraphQL",
  ],
  Database: [
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Redis",
    "Elasticsearch",
    "Prisma",
    "TypeORM",
    "DynamoDB",
    "SQLite",
  ],
  "Cloud & DevOps": [
    "AWS",
    "GCP",
    "Azure",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "Linux",
    "Nginx",
    "Git",
  ],
  Mobile: ["React Native", "Flutter", "iOS/Swift", "Android/Kotlin", "Expo", "Ionic"],
  "Tools & Other": [
    "VS Code",
    "Figma",
    "Jira",
    "Agile/Scrum",
    "REST APIs",
    "Testing",
    "Security",
    "AI/ML",
  ],
};

const SKILL_LEVELS = [
  { value: 1, label: "Beginner", color: "text-pf-fg-subtle" },
  { value: 2, label: "Basic", color: "text-pf-attention-fg" },
  { value: 3, label: "Intermediate", color: "text-pf-accent-fg" },
  { value: 4, label: "Advanced", color: "text-pf-success-fg" },
  { value: 5, label: "Expert", color: "text-pf-done-fg" },
];

export function SkillsStep() {
  const { skills, noSkills, setNoSkills, addSkill, removeSkill, goToNextStep, markStepComplete } =
    useOnboardingStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(SKILL_CATEGORIES)[0] ?? "Programming Languages"
  );
  const [customSkill, setCustomSkill] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const handleAddSkill = (name: string, category: string, level: number = 3) => {
    // Check if already added
    if (skills.some((s: Skill) => s.name.toLowerCase() === name.toLowerCase())) return;

    addSkill({
      id: nanoid(),
      name,
      category,
      level,
    });
  };

  const handleAddCustomSkill = () => {
    if (!customSkill.trim()) return;
    handleAddSkill(customSkill.trim(), customCategory || "Other");
    setCustomSkill("");
  };

  const handleToggleNoSkills = () => {
    setNoSkills(!noSkills);
  };

  const handleNext = () => {
    markStepComplete("skills");
    goToNextStep();
  };

  const canProceed = noSkills || skills.length > 0;

  const isSkillAdded = (name: string) =>
    skills.some((s: Skill) => s.name.toLowerCase() === name.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Technical Skills</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Select your skills or add custom ones
        </p>
      </div>

      {/* No Skills Toggle */}
      <label className="border-pf-border-default bg-pf-canvas-subtle flex cursor-pointer items-center gap-3 border p-3">
        <input
          type="checkbox"
          checked={noSkills}
          onChange={handleToggleNoSkills}
          className="text-pf-accent-fg h-4 w-4"
        />
        <span className="text-pf-fg-muted font-mono text-sm">
          I&apos;m still developing my skills (skip for now)
        </span>
      </label>

      {!noSkills && (
        <>
          {/* Selected Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <div className="text-pf-fg-subtle font-mono text-xs">
                <span className="opacity-60">{"//"}</span> {skills.length} skill
                {skills.length > 1 ? "s" : ""} selected
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: Skill) => (
                  <div
                    key={skill.id}
                    className="border-pf-border-default bg-pf-canvas-subtle flex items-center gap-2 border px-2 py-1"
                  >
                    <span className="text-pf-fg-default font-mono text-xs">{skill.name}</span>
                    <span
                      className={`font-mono text-[10px] ${SKILL_LEVELS.find((l) => l.value === skill.level)?.color || ""}`}
                    >
                      L{skill.level}
                    </span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-pf-fg-subtle hover:text-pf-danger-fg transition-colors"
                    >
                      <X className="h-3 w-3" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="border-pf-border-default border">
            <div className="border-pf-border-muted flex flex-wrap gap-1 border-b p-2">
              {Object.keys(SKILL_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2 py-1 font-mono text-xs transition-colors ${
                    selectedCategory === category
                      ? "bg-pf-accent-subtle text-pf-accent-fg"
                      : "text-pf-fg-muted hover:text-pf-fg-default"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {SKILL_CATEGORIES[selectedCategory as keyof typeof SKILL_CATEGORIES].map(
                  (skill) => {
                    const added = isSkillAdded(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => !added && handleAddSkill(skill, selectedCategory)}
                        disabled={added}
                        className={`flex items-center gap-1 px-2 py-1 font-mono text-xs transition-all ${
                          added
                            ? "bg-pf-success-subtle text-pf-success-fg cursor-default"
                            : "border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg border"
                        }`}
                      >
                        {added && <Zap className="h-3 w-3" />}
                        {skill}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          {/* Custom Skill Input */}
          <div className="border-pf-border-default bg-pf-canvas-subtle border p-4">
            <div className="text-pf-fg-subtle mb-3 font-mono text-xs">
              <span className="opacity-60">{"//"}</span> Add custom skill
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCustomSkill()}
                placeholder="Custom skill name..."
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg flex-1 border px-3 py-2 font-mono text-sm focus:outline-none"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg border px-2 py-2 font-mono text-xs focus:outline-none"
              >
                <option value="">Category</option>
                {Object.keys(SKILL_CATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
              <button
                onClick={handleAddCustomSkill}
                disabled={!customSkill.trim()}
                className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-1 px-3 py-2 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Skill Level Legend */}
          <div className="border-pf-border-muted flex flex-wrap items-center gap-4 border-t pt-4">
            <span className="text-pf-fg-subtle font-mono text-xs">Levels:</span>
            {SKILL_LEVELS.map((level) => (
              <span key={level.value} className={`font-mono text-xs ${level.color}`}>
                L{level.value}={level.label}
              </span>
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
