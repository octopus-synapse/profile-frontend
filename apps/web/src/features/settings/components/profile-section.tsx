/**
 * Profile Section
 * Edit user profile information
 */

"use client";

import { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Globe,
  Linkedin,
  Github,
  Save,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useProfile, useUpdateProfile } from "../hooks";
import { PhoneInput, HelpTooltip } from "@/shared/components/ui";
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
      queueMicrotask(() => {
        setFormData({
          displayName: profile.displayName || profile.name || "",
          bio: profile.bio || "",
          location: profile.location || "",
          phone: profile.phone || "",
          website: profile.website || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        });
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
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Profile Information</h2>
          <p className="mt-1 text-sm text-zinc-400">Your public profile details</p>
        </div>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
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
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <UsernameField />
      </div>

      {/* Form */}
      <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
        {/* Display Name */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleChange("displayName", e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            Bio
            <HelpTooltip content="A brief description visible on your public profile. Keep it concise and professional." />
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="A brief description about yourself..."
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        {/* Location & Phone */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <MapPin className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Phone className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
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
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
            <Globe className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
            Website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder="https://yoursite.com"
            className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        {/* Social Links */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Linkedin className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              LinkedIn
              <HelpTooltip content="Link to your LinkedIn profile. Visible as a social link on your public profile." />
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white">
              <Github className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
              GitHub
              <HelpTooltip content="Link to your GitHub profile. Great for showcasing your open source contributions." />
            </label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="https://github.com/username"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status */}
      {updateProfile.isSuccess && !isDirty && (
        <div className="flex items-center gap-2 text-sm text-emerald-500">
          <Check className="h-4 w-4" />
          Changes saved successfully
        </div>
      )}

      {updateProfile.isError && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          Failed to save changes
        </div>
      )}
    </div>
  );
}
