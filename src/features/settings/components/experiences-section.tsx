/**
 * Experiences Section
 * Manage work experiences
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
    if (!formData.company || !formData.position || !formData.startDate) return;

    const payload: CreateExperiencePayload = {
      company: formData.company,
      position: formData.position,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? null : (formData.endDate || null),
      isCurrent: formData.isCurrent || false,
      description: formData.description || null,
      location: formData.location || null,
    };

    try {
      if (editingId) {
        await updateExperience.mutateAsync({ id: editingId, data: payload });
      } else {
        await createExperience.mutateAsync(payload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save experience:", error);
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
            <Briefcase className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// Work Experience</span>
          </div>
          <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
            {experiences.length} experience{experiences.length !== 1 ? "s" : ""} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg hover:bg-pf-accent-subtle flex items-center gap-2 border border-transparent px-3 py-1.5 font-mono text-sm transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            add_experience
          </button>
        )}
      </div>

      {/* Experience List */}
      {experiences.length > 0 && !isFormOpen && (
        <div className="space-y-3">
          {experiences.map((exp: Experience) => (
            <div
              key={exp.id}
              className="border-pf-border-default bg-pf-canvas-subtle group border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-pf-fg-default font-mono text-sm font-semibold">
                    {exp.position}
                  </h4>
                  <p className="text-pf-fg-muted mt-0.5 flex flex-wrap items-center gap-2 font-mono text-xs">
                    <span className="flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      {exp.company}
                    </span>
                    {exp.location && (
                      <>
                        <span className="text-pf-border-emphasis">•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {exp.location}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-pf-fg-subtle mt-1 flex items-center gap-1 font-mono text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(exp.startDate)} –{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                  </p>
                  {exp.description && (
                    <p className="text-pf-fg-muted mt-2 border-t border-dashed border-pf-border-default pt-2 font-mono text-xs">
                      {exp.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(exp)}
                    className="text-pf-fg-muted hover:text-pf-accent-fg p-1.5 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deleteExperience.isPending}
                    className="text-pf-fg-muted hover:text-pf-danger-fg p-1.5 transition-colors disabled:opacity-50"
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
        <div className="border-pf-border-default border border-dashed p-8 text-center">
          <Briefcase className="text-pf-fg-subtle mx-auto h-8 w-8" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-2 font-mono text-sm">No experiences added yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg mt-3 font-mono text-sm underline-offset-4 hover:underline"
          >
            Add your first experience
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
          <div className="flex items-center justify-between">
            <span className="text-pf-accent-fg font-mono text-xs">
              <span className="opacity-60">{"//"}</span>{" "}
              {editingId ? "Edit experience" : "New experience"}
            </span>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                company<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
                placeholder="Google"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                position<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData((p) => ({ ...p, position: e.target.value }))}
                placeholder="Senior Engineer"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-pf-fg-default mb-1 block font-mono text-xs">location</label>
            <input
              type="text"
              value={formData.location || ""}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
              placeholder="Mountain View, CA"
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                startDate<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">endDate</label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                disabled={formData.isCurrent}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData((p) => ({ ...p, isCurrent: e.target.checked }))}
              className="text-pf-accent-fg h-4 w-4"
            />
            <span className="text-pf-fg-muted font-mono text-xs">I currently work here</span>
          </label>

          <div>
            <label className="text-pf-fg-default mb-1 block font-mono text-xs">description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full resize-none border px-3 py-2 font-mono text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default px-3 py-1.5 font-mono text-sm transition-colors"
            >
              cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.company || !formData.position || !formData.startDate || isSaving}
              className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis flex items-center gap-2 px-3 py-1.5 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingId ? "update" : "add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
