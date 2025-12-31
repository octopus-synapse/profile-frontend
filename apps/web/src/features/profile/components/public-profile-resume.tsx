/**
 * Public Profile Resume Component
 * Displays the user's resume content in a clean format
 */

"use client";

import type { Resume } from "@/features/resume/types";
import { Briefcase, GraduationCap, Code, Languages, FileText } from "lucide-react";

interface PublicProfileResumeProps {
  resume: Resume;
}

export function PublicProfileResume({ resume }: PublicProfileResumeProps) {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Summary */}
        {resume.summary && (
          <Section icon={FileText} title="About">
            <p className="text-pf-fg-muted leading-relaxed whitespace-pre-wrap">{resume.summary}</p>
          </Section>
        )}

        {/* Experience */}
        {resume.experiences && resume.experiences.length > 0 && (
          <Section icon={Briefcase} title="Experience">
            <div className="space-y-6">
              {resume.experiences.map((exp) => (
                <div key={exp.id} className="border-pf-border-default relative border-l-2 pl-6">
                  <div className="bg-pf-accent-emphasis ring-pf-canvas-default absolute top-0 -left-[9px] h-4 w-4 rounded-full ring-4" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-pf-fg-default font-semibold">{exp.position}</h4>
                      <p className="text-pf-accent-fg font-medium">{exp.company}</p>
                    </div>
                    <span className="text-pf-fg-muted shrink-0 text-sm">
                      {formatDate(exp.startDate)} –{" "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.location && <p className="text-pf-fg-subtle mt-1 text-sm">{exp.location}</p>}
                  {exp.description && (
                    <p className="text-pf-fg-muted mt-3 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {resume.educations && resume.educations.length > 0 && (
          <Section icon={GraduationCap} title="Education">
            <div className="space-y-6">
              {resume.educations.map((edu) => (
                <div key={edu.id} className="border-pf-border-default relative border-l-2 pl-6">
                  <div className="bg-pf-success-emphasis ring-pf-canvas-default absolute top-0 -left-[9px] h-4 w-4 rounded-full ring-4" />
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h4 className="text-pf-fg-default font-semibold">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-pf-accent-fg font-medium">{edu.institution}</p>
                    </div>
                    <span className="text-pf-fg-muted shrink-0 text-sm">
                      {formatDate(edu.startDate)} –{" "}
                      {edu.current ? "Present" : formatDate(edu.endDate)}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-pf-fg-muted mt-3 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <Section icon={Code} title="Skills">
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill) => {
                // Map skill level to numeric value for display
                const levelMap: Record<string, number> = {
                  BEGINNER: 1,
                  INTERMEDIATE: 2,
                  ADVANCED: 3,
                  EXPERT: 4,
                };
                const numericLevel = skill.level ? (levelMap[skill.level] ?? 0) : 0;

                return (
                  <span
                    key={skill.id}
                    className="bg-pf-canvas-subtle text-pf-fg-default ring-pf-border-default inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1"
                  >
                    {skill.name}
                    {numericLevel > 0 && (
                      <span className="flex gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={`h-1.5 w-1.5 rounded-full ${
                              i <= numericLevel ? "bg-pf-accent-emphasis" : "bg-pf-border-default"
                            }`}
                          />
                        ))}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </Section>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <Section icon={Languages} title="Languages">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resume.languages.map((lang) => (
                <div
                  key={lang.id}
                  className="bg-pf-canvas-subtle ring-pf-border-default flex items-center justify-between rounded-lg p-4 ring-1"
                >
                  <span className="text-pf-fg-default font-medium">{lang.name}</span>
                  <span className="text-pf-fg-muted text-sm capitalize">{lang.level}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>
    </main>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Briefcase;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-pf-canvas-overlay ring-pf-border-default rounded-xl p-6 shadow-sm ring-1">
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-pf-accent-subtle flex h-10 w-10 items-center justify-center rounded-lg">
          <Icon className="text-pf-accent-fg h-5 w-5" strokeWidth={1.5} />
        </div>
        <h3 className="text-pf-fg-default text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}
