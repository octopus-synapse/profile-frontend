/**
 * Preferences Section
 * Theme, language, and other preferences
 */

"use client";

import { Moon, Sun, Monitor, Globe, Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";
import { preferencesRepository } from "../services/settings-repository";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function PreferencesSection() {
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["preferences", "full"],
    queryFn: () => preferencesRepository.getFullPreferences(),
  });

  const updatePreferences = useMutation({
    mutationFn: (data: { profileVisibility: "public" | "private" }) =>
      preferencesRepository.updateFullPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["preferences"] });
    },
  });

  const profileVisibility = preferences?.profileVisibility ?? "private";

  const handleVisibilityChange = (visibility: "public" | "private") => {
    updatePreferences.mutate({ profileVisibility: visibility });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-pf-fg-default text-lg font-semibold">Preferences</h2>
        <p className="text-pf-fg-muted mt-1 text-sm">Customize your experience</p>
      </div>

      {/* Theme Selection */}
      <div className="border-pf-border-default bg-pf-canvas-subtle rounded-xl border p-6">
        <h3 className="text-pf-fg-default mb-4 text-sm font-semibold">Appearance</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
                theme === value
                  ? "border-pf-fg-default bg-pf-canvas-overlay"
                  : "border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${theme === value ? "text-pf-fg-default" : "text-pf-fg-muted"}`}
                strokeWidth={1.5}
              />
              <span
                className={`text-sm ${
                  theme === value ? "text-pf-fg-default font-semibold" : "text-pf-fg-default"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Visibility */}
      <div className="border-pf-border-default bg-pf-canvas-subtle rounded-xl border p-6">
        <h3 className="text-pf-fg-default mb-2 text-sm font-semibold">Profile Visibility</h3>
        <p className="text-pf-fg-muted mb-4 text-sm">Control who can see your public profile</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => handleVisibilityChange("public")}
            disabled={updatePreferences.isPending || isLoading}
            className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
              profileVisibility === "public"
                ? "border-pf-success-fg bg-pf-canvas-overlay"
                : "border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis"
            } ${updatePreferences.isPending ? "opacity-50" : ""}`}
          >
            <Eye
              className={`h-5 w-5 ${
                profileVisibility === "public" ? "text-pf-success-fg" : "text-pf-fg-muted"
              }`}
              strokeWidth={1.5}
            />
            <div className="flex-1 text-left">
              <span
                className={`block text-sm ${
                  profileVisibility === "public"
                    ? "text-pf-fg-default font-semibold"
                    : "text-pf-fg-default"
                }`}
              >
                Public
              </span>
              <span className="text-pf-fg-subtle text-xs">Anyone can view</span>
            </div>
            {profileVisibility === "public" && <Check className="text-pf-success-fg h-4 w-4" />}
          </button>
          <button
            onClick={() => handleVisibilityChange("private")}
            disabled={updatePreferences.isPending || isLoading}
            className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
              profileVisibility === "private"
                ? "border-pf-fg-default bg-pf-canvas-overlay"
                : "border-pf-border-default bg-pf-canvas-overlay hover:border-pf-border-emphasis"
            } ${updatePreferences.isPending ? "opacity-50" : ""}`}
          >
            <EyeOff
              className={`h-5 w-5 ${
                profileVisibility === "private" ? "text-pf-fg-default" : "text-pf-fg-muted"
              }`}
              strokeWidth={1.5}
            />
            <div className="flex-1 text-left">
              <span
                className={`block text-sm ${
                  profileVisibility === "private"
                    ? "text-pf-fg-default font-semibold"
                    : "text-pf-fg-default"
                }`}
              >
                Private
              </span>
              <span className="text-pf-fg-muted text-xs">Only you can view</span>
            </div>
            {profileVisibility === "private" && <Check className="text-pf-fg-default h-4 w-4" />}
          </button>
        </div>
        {updatePreferences.isPending && (
          <p className="text-pf-fg-muted mt-4 flex items-center gap-2 text-xs">
            <Loader2 className="h-3 w-3 animate-spin" />
            Updating...
          </p>
        )}
      </div>

      {/* Language Setting - Preview (not connected yet) */}
      <div className="border-pf-border-default bg-pf-canvas-subtle rounded-xl border p-6">
        <h3 className="text-pf-fg-default mb-2 text-sm font-semibold">Interface Language</h3>
        <p className="text-pf-fg-muted mb-4 text-sm">Choose your preferred interface language</p>
        <div className="flex items-center gap-3">
          <Globe className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <select
            disabled
            className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default flex-1 rounded-lg border px-4 py-2.5 text-sm opacity-50"
          >
            <option value="en">English</option>
            <option value="pt">Português</option>
            <option value="es">Español</option>
          </select>
        </div>
        <p className="text-pf-fg-subtle mt-4 text-xs">Multi-language support coming soon</p>
      </div>
    </div>
  );
}
