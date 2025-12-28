/**
 * Education Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Education } from "../../types";
import { GraduationCap, Calendar } from "lucide-react";

interface Props {
  education: Education[];
}

export function EducationSection({ education }: Props) {
  const { colors, classes } = useStyleConfig();

  if (!education.length) return null;

  return (
    <Section id="education" title="Education">
      <div className="space-y-4">
        {education.map((edu) => (
          <article key={edu.id}>
            <div className="flex items-start gap-2">
              <GraduationCap className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colors.primary }} />
              <div className="flex-1">
                <h3 className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                  {edu.degree}
                  {edu.field && ` in ${edu.field}`}
                </h3>
                <p className="text-sm" style={{ color: colors.text.accent }}>
                  {edu.institution}
                </p>
                <span
                  className="mt-1 flex items-center gap-1 text-xs"
                  style={{ color: colors.text.secondary }}
                >
                  <Calendar className="h-3 w-3" />
                  {formatDate(edu.startDate)} – {edu.current ? "Present" : formatDate(edu.endDate)}
                </span>
                {edu.description && (
                  <p
                    className={`mt-2 ${classes.bodyText} text-xs leading-relaxed`}
                    style={{ color: colors.text.secondary }}
                  >
                    {edu.description}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric" });
}
