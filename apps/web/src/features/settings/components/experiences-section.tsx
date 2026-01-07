/**
 * Experiences Section
 * Manage work experiences
 * Validation via @octopus-synapse/profile-contracts (single source of truth)
 */

"use client";

import { useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Pencil,
  Calendar,
  MapPin,
  Building,
  X,
  Loader2,
} from "lucide-react";
import {
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "../hooks";
import type { Experience, CreateExperiencePayload } from "../types";
import { ExperienceSchema } from "@octopus-synapse/profile-contracts";
import { toast } from "sonner";

const emptyExperience: Partial<CreateExperiencePayload> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  location: "",
};

export function ExperiencesSection() {
  const { data, isLoading } = useExperiences();
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  const deleteExperience = useDeleteExperience();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateExperiencePayload>>(emptyExperience);

  const experiences = data?.data || [];

  const handleStartAdd = () => {
    setFormData(emptyExperience);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (exp: Experience) => {
    setFormData({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      isCurrent: exp.isCurrent,
      description: exp.description || "",
      location: exp.location || "",
    });
    setEditingId(exp.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyExperience);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    const payload = {
      company: formData.company || "",
      position: formData.position || "",
      startDate: formData.startDate || "",
      endDate: formData.isCurrent ? undefined : formData.endDate || undefined,
      isCurrent: formData.isCurrent || false,
      description: formData.description || undefined,
      location: formData.location || undefined,
    };

    const validation = ExperienceSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError?.message || "Invalid data");
      return;
    }

    try {
      const apiPayload: CreateExperiencePayload = {
        ...validation.data,
        endDate: validation.data.endDate ?? null,
        description: validation.data.description ?? null,
        location: validation.data.location ?? null,
      };

      if (editingId) {
        await updateExperience.mutateAsync({ id: editingId, data: apiPayload });
      } else {
        await createExperience.mutateAsync(apiPayload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save experience:", error);
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await deleteExperience.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete experience:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const isSaving = createExperience.isPending || updateExperience.isPending;
  const isFormOpen = isAdding || editingId !== null;

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
          <h2 className="text-lg font-semibold text-white">Work Experience</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {experiences.length} experience{experiences.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Experience
          </button>
        )}
      </div>

      {/* Experience List */}
      {experiences.length > 0 && !isFormOpen && (
        <div className="space-y-3">
          {experiences.map((exp: Experience) => (
            <div key={exp.id} className="group rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-white">{exp.position}</h4>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Building className="h-4 w-4" />
                      {exp.company}
                    </span>
                    {exp.location && (
                      <>
                        <span className="text-white/20">•</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {exp.location}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                  </p>
                  {exp.description && (
                    <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-zinc-400">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(exp)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#0A0A0A]/80 hover:text-white"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deleteExperience.isPending}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#0A0A0A]/80 hover:text-red-500 disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {experiences.length === 0 && !isFormOpen && (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-zinc-500" strokeWidth={1} />
          <p className="mt-3 text-sm text-zinc-400">No experiences added yet</p>
          <button
            onClick={handleStartAdd}
            className="mt-4 text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            Add your first experience
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              {editingId ? "Edit Experience" : "New Experience"}
            </h3>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                placeholder="Google"
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
                placeholder="Product Manager"
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Location</label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              placeholder="Mountain View, CA"
              className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">End Date</label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                disabled={formData.isCurrent}
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData((p) => ({ ...p, isCurrent: e.target.checked }))}
              className="h-4 w-4 rounded border-white/10"
            />
            <span className="text-sm text-zinc-400">I currently work here</span>
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.company || !formData.position || !formData.startDate || isSaving}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
