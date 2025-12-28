/**
 * Certifications Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";
import type { Certification } from "../../types";
import { Award, Calendar, ExternalLink } from "lucide-react";

interface Props {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: Props) {
  const { colors } = useStyleConfig();

  if (!certifications.length) return null;

  return (
    <Section id="certifications" title="Certifications">
      <div className="space-y-3">
        {certifications.map((cert) => (
          <article key={cert.id} className="flex items-start gap-2">
            <Award className="mt-0.5 h-4 w-4 shrink-0" style={{ color: colors.primary }} />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold" style={{ color: colors.text.primary }}>
                  {cert.name}
                </h3>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    className="flex items-center gap-1 text-xs hover:underline"
                    style={{ color: colors.primary }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <p className="text-sm" style={{ color: colors.text.accent }}>
                {cert.issuer}
              </p>
              {cert.issueDate && (
                <span
                  className="mt-1 flex items-center gap-1 text-xs"
                  style={{ color: colors.text.secondary }}
                >
                  <Calendar className="h-3 w-3" />
                  {new Date(cert.issueDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
