/**
 * Preferences Section
 * Theme, language, and other preferences
 */

"use client";

import {
 Moon,
 Sun,
 Monitor,
 Globe,
 Eye,
 EyeOff,
 Loader2,
 Check,
} from "lucide-react";
import { useTheme } from "@/shared/providers/theme-provider";
import { preferencesRepository } from "./services/settings-repository";
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
   void queryClient.invalidateQueries({ queryKey: ["preferences"] });
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
    <h2 className="text-lg font-semibold text-white">Preferences</h2>
    <p className="mt-1 text-sm text-zinc-400">Customize your experience</p>
   </div>

   {/* Theme Selection */}
   <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <h3 className="mb-4 text-sm font-semibold text-white">Appearance</h3>
    <div className="grid gap-3 sm:grid-cols-3">
     {THEMES.map(({ value, label, icon: Icon }) => (
      <button
       key={value}
       onClick={() => setTheme(value)}
       className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
        theme === value
         ? "border-white bg-[#0A0A0A]/80"
         : "border-white/10 bg-[#0A0A0A]/80 hover:border-white/20"
       }`}
      >
       <Icon
        className={`h-5 w-5 ${theme === value ? "text-white" : "text-zinc-400"}`}
        strokeWidth={1.5}
       />
       <span
        className={`text-sm ${theme === value ? "font-semibold text-white" : "text-white"}`}
       >
        {label}
       </span>
      </button>
     ))}
    </div>
   </div>

   {/* Profile Visibility */}
   <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <h3 className="mb-2 text-sm font-semibold text-white">
     Profile Visibility
    </h3>
    <p className="mb-4 text-sm text-zinc-400">
     Control who can see your public profile
    </p>
    <div className="grid gap-3 sm:grid-cols-2">
     <button
      onClick={() => handleVisibilityChange("public")}
      disabled={updatePreferences.isPending || isLoading}
      className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
       profileVisibility === "public"
        ? "border-emerald-500 bg-[#0A0A0A]/80"
        : "border-white/10 bg-[#0A0A0A]/80 hover:border-white/20"
      } ${updatePreferences.isPending ? "opacity-50" : ""}`}
     >
      <Eye
       className={`h-5 w-5 ${
        profileVisibility === "public" ? "text-emerald-500" : "text-zinc-400"
       }`}
       strokeWidth={1.5}
      />
      <div className="flex-1 text-left">
       <span
        className={`block text-sm ${
         profileVisibility === "public"
          ? "font-semibold text-white"
          : "text-white"
        }`}
       >
        Public
       </span>
       <span className="text-xs text-zinc-500">Anyone can view</span>
      </div>
      {profileVisibility === "public" && (
       <Check className="h-4 w-4 text-emerald-500" />
      )}
     </button>
     <button
      onClick={() => handleVisibilityChange("private")}
      disabled={updatePreferences.isPending || isLoading}
      className={`flex items-center gap-3 rounded-lg border p-4 transition-all ${
       profileVisibility === "private"
        ? "border-white bg-[#0A0A0A]/80"
        : "border-white/10 bg-[#0A0A0A]/80 hover:border-white/20"
      } ${updatePreferences.isPending ? "opacity-50" : ""}`}
     >
      <EyeOff
       className={`h-5 w-5 ${
        profileVisibility === "private" ? "text-white" : "text-zinc-400"
       }`}
       strokeWidth={1.5}
      />
      <div className="flex-1 text-left">
       <span
        className={`block text-sm ${
         profileVisibility === "private"
          ? "font-semibold text-white"
          : "text-white"
        }`}
       >
        Private
       </span>
       <span className="text-xs text-zinc-400">Only you can view</span>
      </div>
      {profileVisibility === "private" && (
       <Check className="h-4 w-4 text-white" />
      )}
     </button>
    </div>
    {updatePreferences.isPending && (
     <p className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
      <Loader2 className="h-3 w-3 animate-spin" />
      Updating...
     </p>
    )}
   </div>

   {/* Language Setting - Preview (not connected yet) */}
   <div className="rounded-xl border border-white/10 bg-white/5 p-6">
    <h3 className="mb-2 text-sm font-semibold text-white">
     Interface Language
    </h3>
    <p className="mb-4 text-sm text-zinc-400">
     Choose your preferred interface language
    </p>
    <div className="flex items-center gap-3">
     <Globe className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
     <select
      disabled
      className="flex-1 rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white opacity-50"
     >
      <option value="en">English</option>
      <option value="pt">Português</option>
      <option value="es">Español</option>
     </select>
    </div>
    <p className="mt-4 text-xs text-zinc-500">
     Multi-language support coming soon
    </p>
   </div>
  </div>
 );
}
