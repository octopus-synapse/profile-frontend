/**
 * Projects Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Project } from "../../types";
import { FolderGit2, ExternalLink } from "lucide-react";

interface Props {
  projects: Project[];
}

export function ProjectsSection({ projects }: Props) {
  const { colors, classes } = useStyleConfig();

  if (!projects.length) return null;

  return (
    <Section id="projects" title="Projects">
      <div className="space-y-4">
        {projects.map((project, index) => (
          <article
            key={project.id}
            className={index !== projects.length - 1 ? "border-b pb-4" : ""}
            style={{ borderColor: colors.divider }}
          >
            <div className="flex items-start gap-2">
              <FolderGit2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colors.primary }} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                    {project.name}
                  </h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="flex items-center gap-1 text-xs hover:underline"
                      style={{ color: colors.primary }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p
                    className={`mt-1 ${classes.bodyText} text-sm leading-relaxed whitespace-pre-wrap`}
                    style={{ color: colors.text.secondary }}
                  >
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: colors.surface,
                          borderColor: colors.border,
                          color: colors.text.secondary,
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
