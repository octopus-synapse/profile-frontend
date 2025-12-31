/**
 * Profile Section
 * Edit user profile information
 */

"use client";

import { useState, useEffect } from "react";
import { User, MapPin, Phone, Globe, Linkedin, Github, Save, Loader2, Check, AlertCircle } from "lucide-react";
import { useProfile, useUpdateProfile } from "../hooks";
import { PhoneInput } from "@/shared/components/ui";
import { UsernameField } from "./username-field";
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
          <h2 className="text-pf-fg-default text-lg font-semibold">Profile Information</h2>
          <p className="text-pf-fg-muted mt-1 text-sm">
            Your public profile details
          </p>
        </div>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="bg-pf-fg-default text-pf-canvas-default flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateProfile.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" strokeWidth={1.5} />
            )}
            Save Changes
          </button>
        )}
      </div>

      {/* Username Field (separate from main form) */}
      <div className="border-pf-border-default bg-pf-canvas-subtle rounded-xl border p-6">
        <UsernameField />
      </div>

      {/* Form */}
      <div className="border-pf-border-default bg-pf-canvas-subtle space-y-5 rounded-xl border p-6">
        {/* Display Name */}
        <div>
          <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
            <User className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="John Doe"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-pf-fg-default mb-2 block text-sm font-medium">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="A brief description about yourself..."
            rows={3}
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Location & Phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
              <Phone className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
              Phone
            </label>
            <PhoneInput
              value={formData.phone}
              onChange={(value) => handleChange("phone", value)}
              countryFormat="BR"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yoursite.com"
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
          />
        </div>

        {/* Social Links */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
              <Linkedin className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
              LinkedIn
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="text-pf-fg-default mb-2 flex items-center gap-2 text-sm font-medium">
              <Github className="h-4 w-4 text-pf-fg-muted" strokeWidth={1.5} />
              GitHub
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="https://github.com/username"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      {updateProfile.isSuccess && !isDirty && (
        <div className="text-pf-success-fg flex items-center gap-2 text-sm">
          <Check className="h-4 w-4" />
          Changes saved successfully
        </div>
      )}

      {updateProfile.isError && (
        <div className="text-pf-danger-fg flex items-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4" />
          Failed to save changes
        </div>
      )}
    </div>
  );
}
