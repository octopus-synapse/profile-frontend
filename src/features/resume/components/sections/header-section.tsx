/**
 * Header Section Component
 */

"use client";

import { useStyleConfig } from "../context/style-context";
import type { Resume } from "../../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

interface Props {
  resume: Pick<
    Resume,
    | "fullName"
    | "jobTitle"
    | "emailContact"
    | "phone"
    | "location"
    | "linkedin"
    | "github"
    | "website"
  >;
}

export function HeaderSection({ resume }: Props) {
  const { colors, classes } = useStyleConfig();

  return (
    <header
      className={`${classes.padding} border-b`}
      style={{ backgroundColor: colors.surface, borderColor: colors.border }}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: colors.text.primary }}>
          {resume.fullName || "Your Name"}
        </h1>
        {resume.jobTitle && (
          <p className="mt-2 text-lg font-medium" style={{ color: colors.text.accent }}>
            {resume.jobTitle}
          </p>
        )}
      </div>

      {/* Contact Info */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        {resume.emailContact && (
          <span className="flex items-center gap-1.5" style={{ color: colors.text.secondary }}>
            <Mail className="h-3.5 w-3.5" />
            {resume.emailContact}
          </span>
        )}
        {resume.phone && (
          <span className="flex items-center gap-1.5" style={{ color: colors.text.secondary }}>
            <Phone className="h-3.5 w-3.5" />
            {resume.phone}
          </span>
        )}
        {resume.location && (
          <span className="flex items-center gap-1.5" style={{ color: colors.text.secondary }}>
            <MapPin className="h-3.5 w-3.5" />
            {resume.location}
          </span>
        )}
      </div>

      {/* Links */}
      {(resume.linkedin || resume.github || resume.website) && (
        <div className="mt-3 flex justify-center gap-4 text-sm">
          {resume.linkedin && (
            <a
              href={resume.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
              style={{ color: colors.primary }}
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
          {resume.github && (
            <a
              href={resume.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
              style={{ color: colors.primary }}
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          )}
          {resume.website && (
            <a
              href={resume.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline"
              style={{ color: colors.primary }}
            >
              <Globe className="h-3.5 w-3.5" />
              Website
            </a>
          )}
        </div>
      )}
    </header>
  );
}
