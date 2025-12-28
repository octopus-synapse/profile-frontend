/**
 * Experience Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Experience } from "../../types";
import { Building2, Calendar } from "lucide-react";

interface Props {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: Props) {
  const { colors, classes } = useStyleConfig();

  if (!experiences.length) return null;

  return (
    <Section id="experiences" title="Experience">
      <div className="space-y-5">
        {experiences.map((exp, index) => (
          <article
            key={exp.id}
            className={index !== experiences.length - 1 ? "border-b pb-5" : ""}
            style={{ borderColor: colors.divider }}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-base font-semibold" style={{ color: colors.text.primary }}>
                  {exp.position}
                </h3>
                <p className="flex items-center gap-1.5 text-sm" style={{ color: colors.text.accent }}>
                  <Building2 className="h-3.5 w-3.5" />
                  {exp.company}
                  {exp.location && <span className="text-xs">• {exp.location}</span>}
                </p>
              </div>
              <span
                className="flex items-center gap-1 whitespace-nowrap text-xs"
                style={{ color: colors.text.secondary }}
              >
                <Calendar className="h-3 w-3" />
                {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
              </span>
            </div>
            {exp.description && (
              <p
                className={`mt-2 ${classes.bodyText} leading-relaxed whitespace-pre-wrap`}
                style={{ color: colors.text.secondary }}
              >
                {exp.description}
              </p>
            )}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="mt-2 space-y-1">
                {exp.achievements.map((achievement, idx) => (
                  <li
                    key={idx}
                    className={`${classes.bodyText} flex items-start gap-2`}
                    style={{ color: colors.text.secondary }}
                  >
                    <span style={{ color: colors.primary }}>•</span>
                    {achievement}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </Section>
  );
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
