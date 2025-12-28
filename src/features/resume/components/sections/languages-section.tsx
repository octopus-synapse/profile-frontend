/**
 * Languages Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Language } from "../../types";
import { Languages } from "lucide-react";

interface Props {
  languages: Language[];
}

const levelLabels: Record<string, string> = {
  BASIC: "Basic",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  FLUENT: "Fluent",
  NATIVE: "Native",
};

export function LanguagesSection({ languages }: Props) {
  const { colors } = useStyleConfig();

  if (!languages.length) return null;

  return (
    <Section id="languages" title="Languages">
      <div className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <Languages className="h-3.5 w-3.5 shrink-0" style={{ color: colors.primary }} />
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm" style={{ color: colors.text.primary }}>
                {lang.name}
              </span>
              <span
                className="rounded px-1.5 py-0.5 text-xs"
                style={{ backgroundColor: colors.surface, color: colors.text.secondary }}
              >
                {levelLabels[lang.level] || lang.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
