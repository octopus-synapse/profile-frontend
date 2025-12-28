/**
 * Skills Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Skill } from "../../types";

interface Props {
  skills: Skill[];
}

export function SkillsSection({ skills }: Props) {
  const { colors } = useStyleConfig();

  if (!skills.length) return null;

  // Group by category
  const grouped = skills.reduce(
    (acc, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

  return (
    <Section id="skills" title="Skills">
      <div className="space-y-4">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h4
              className="mb-2 text-sm font-medium uppercase tracking-wide"
              style={{ color: colors.text.accent }}
            >
              {category}
            </h4>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-md border px-2.5 py-1 text-sm"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text.primary,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
