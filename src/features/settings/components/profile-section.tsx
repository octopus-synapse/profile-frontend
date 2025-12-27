/**
 * Profile Section
 * Edit user profile information
 */

"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Phone, Globe, Linkedin, Github, Save, Loader2 } from "lucide-react";
import { useProfile, useUpdateProfile } from "../hooks";
import type { UpdateProfilePayload } from "../types";

export function ProfileSection() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState<UpdateProfilePayload>({
    displayName: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    linkedin: "",
    github: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || profile.name || "",
        bio: profile.bio || "",
        location: profile.location || "",
        phone: profile.phone || "",
        website: profile.website || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
      });
    }
  }, [profile]);

  const handleChange = (field: keyof UpdateProfilePayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-pf-fg-muted h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <User className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// Profile Information</span>
          </div>
          <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
            Your public profile details
          </p>
        </div>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="bg-pf-accent-fg text-pf-fg-on-emphasis flex items-center gap-2 px-4 py-2 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            save_changes
          </button>
        )}
      </div>

      {/* Form */}
      <div className="border-pf-border-default bg-pf-canvas-subtle space-y-4 border p-6">
        {/* Display Name */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
            <User className="h-3 w-3" strokeWidth={1.5} />
            displayName
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="John Doe"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-pf-fg-default mb-1.5 block font-mono text-xs">bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="A brief description about yourself..."
            rows={3}
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full resize-none border px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        {/* Location & Phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
              <MapPin className="h-3 w-3" strokeWidth={1.5} />
              location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
              <Phone className="h-3 w-3" strokeWidth={1.5} />
              phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
            <Globe className="h-3 w-3" strokeWidth={1.5} />
            website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yoursite.com"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>

        {/* Social Links */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
              <Linkedin className="h-3 w-3" strokeWidth={1.5} />
              linkedin
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-xs">
              <Github className="h-3 w-3" strokeWidth={1.5} />
              github
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="https://github.com/username"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      {updateProfile.isSuccess && !isDirty && (
        <div className="text-pf-success-fg font-mono text-xs">
          <span className="opacity-60">{"//"}</span> Changes saved successfully
        </div>
      )}

      {updateProfile.isError && (
        <div className="text-pf-danger-fg font-mono text-xs">
          <span className="opacity-60">{"//"}</span> Failed to save changes
        </div>
      )}
    </div>
  );
}
