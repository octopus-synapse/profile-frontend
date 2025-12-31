/**
 * Public Profile Header Component
 * Displays user info: avatar, name, bio, links
 */

"use client";

import { MapPin, Globe, Linkedin, Github, Mail, Phone, AtSign } from "lucide-react";
import { Avatar } from "@/shared/components/ui";

interface ProfileDisplayData {
  name: string;
  jobTitle: string | null;
  photoURL: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  github: string | null;
  email: string | null;
  phone: string | null;
}

interface PublicProfileHeaderProps {
  data: ProfileDisplayData;
  username: string;
}

export function PublicProfileHeader({ data, username }: PublicProfileHeaderProps) {
  const initials = data.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const socialLinks = [
    data.website && { icon: Globe, href: data.website, label: "Website" },
    data.linkedin && {
      icon: Linkedin,
      href: data.linkedin.startsWith("http")
        ? data.linkedin
        : `https://linkedin.com/in/${data.linkedin}`,
      label: "LinkedIn",
    },
    data.github && {
      icon: Github,
      href: data.github.startsWith("http") ? data.github : `https://github.com/${data.github}`,
      label: "GitHub",
    },
  ].filter(Boolean) as { icon: typeof Globe; href: string; label: string }[];

  return (
    <header className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pf-accent-emphasis/10 via-pf-canvas-subtle to-pf-canvas-default" />

      {/* Content */}
      <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative">
            <Avatar
              src={data.photoURL}
              alt={data.name}
              fallback={initials}
              size="xl"
              className="h-32 w-32 ring-4 ring-pf-canvas-default shadow-xl sm:h-36 sm:w-36"
            />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-pf-canvas-overlay px-3 py-1 text-xs font-medium text-pf-fg-muted shadow-sm ring-1 ring-pf-border-default">
                <AtSign className="h-3 w-3" />
                {username}
              </span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="mt-8">
            <h1 className="text-pf-fg-default text-3xl font-bold tracking-tight sm:text-4xl">
              {data.name}
            </h1>
            {data.jobTitle && (
              <p className="mt-2 text-lg text-pf-accent-fg font-medium">
                {data.jobTitle}
              </p>
            )}
          </div>

          {/* Location */}
          {data.location && (
            <div className="mt-4 flex items-center gap-1.5 text-pf-fg-muted">
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              <span className="text-sm">{data.location}</span>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex items-center gap-2 text-sm text-pf-fg-muted hover:text-pf-fg-default transition-colors"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                {data.email}
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex items-center gap-2 text-sm text-pf-fg-muted hover:text-pf-fg-default transition-colors"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {data.phone}
              </a>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-11 w-11 items-center justify-center rounded-full bg-pf-canvas-overlay text-pf-fg-muted ring-1 ring-pf-border-default transition-all hover:bg-pf-accent-emphasis hover:text-white hover:ring-pf-accent-emphasis hover:scale-110"
                  aria-label={link.label}
                >
                  <link.icon className="h-5 w-5" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
