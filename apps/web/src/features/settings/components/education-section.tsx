/**
 * Education Section
 * Manage education entries
 * Validation via @octopus-synapse/profile-contracts (single source of truth)
 */

"use client";

import { useState } from "react";
import { GraduationCap, Plus, Trash2, Pencil, Calendar, BookOpen, X, Loader2 } from "lucide-react";
import { useEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from "../hooks";
import type { Education, CreateEducationPayload } from "../types";
import {
  InstitutionAutocomplete,
  CourseAutocomplete,
  type MecInstitution,
  type MecCourse,
} from "@/features/mec";
import { EducationSchema } from "@octopus-synapse/profile-contracts";
import { toast } from "sonner";

// Map MEC grau to degree options
const mapGrauToDegree = (grau: string | null): string => {
  if (!grau) return "";
  const mapping: Record<string, string> = {
    Bacharelado: "Bachelor's",
    Licenciatura: "Bachelor's",
    Tecnológico: "Associate's",
    Sequencial: "Certificate",
    "Área Básica de Ingresso (ABI)": "Bachelor's",
  };
  return mapping[grau] || "";
};

interface FormData extends Partial<CreateEducationPayload> {
  institutionCode?: number | null;
  courseCode?: number | null;
  location?: string;
}

const emptyEducation: FormData = {
  institution: "",
  degree: "",
  field: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  institutionCode: null,
  courseCode: null,
  location: "",
};

export function EducationSection() {
  const { data, isLoading } = useEducation();
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  const deleteEducation = useDeleteEducation();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyEducation);

  const educationList = data?.data || [];

  const handleInstitutionChange = (codigoIes: number | null, institution?: MecInstitution) => {
    setFormData((prev) => ({
      ...prev,
      institutionCode: codigoIes,
      institution: institution
        ? institution.sigla
          ? `${institution.sigla} - ${institution.nome}`
          : institution.nome
        : "",
      // Auto-fill location from institution data
      location:
        institution?.municipio && institution?.uf
          ? `${institution.municipio}, ${institution.uf}`
          : institution?.uf || "",
      // Reset course when institution changes
      courseCode: null,
      field: "",
    }));
  };

  const handleCourseChange = (codigoCurso: number | null, course?: MecCourse) => {
    setFormData((prev) => ({
      ...prev,
      courseCode: codigoCurso,
      field: course?.nome || "",
      // Auto-fill degree from course grau if not already set
      degree: prev.degree || mapGrauToDegree(course?.grau ?? null),
    }));
  };

  const handleStartAdd = () => {
    setFormData(emptyEducation);
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (edu: Education) => {
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate || "",
      isCurrent: edu.isCurrent,
      description: edu.description || "",
    });
    setEditingId(edu.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setFormData(emptyEducation);
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    const payload = {
      institution: formData.institution || "",
      degree: formData.degree || "",
      field: formData.field || "",
      startDate: formData.startDate || "",
      endDate: formData.isCurrent ? undefined : formData.endDate || undefined,
      isCurrent: formData.isCurrent || false,
      description: formData.description || undefined,
    };

    const validation = EducationSchema.safeParse(payload);
    if (!validation.success) {
      const firstError = validation.error.errors[0];
      toast.error(firstError?.message || "Invalid data");
      return;
    }

    try {
      const apiPayload: CreateEducationPayload = {
        ...validation.data,
        endDate: validation.data.endDate ?? null,
        description: validation.data.description ?? null,
      };

      if (editingId) {
        await updateEducation.mutateAsync({ id: editingId, data: apiPayload });
      } else {
        await createEducation.mutateAsync(apiPayload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save education:", error);
      toast.error("Failed to save education");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      await deleteEducation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete education:", error);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const isSaving = createEducation.isPending || updateEducation.isPending;
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
          <h2 className="text-lg font-semibold text-white">Education</h2>
          <p className="mt-1 text-sm text-zinc-400">
            {educationList.length} entr{educationList.length !== 1 ? "ies" : "y"} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/5"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Add Education
          </button>
        )}
      </div>

      {/* Education List */}
      {educationList.length > 0 && !isFormOpen && (
        <div className="space-y-3">
          {educationList.map((edu: Education) => (
            <div key={edu.id} className="group rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-white">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                    <BookOpen className="h-4 w-4" />
                    {edu.institution}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-zinc-500">
                    <Calendar className="h-4 w-4" />
                    {formatDate(edu.startDate)} –{" "}
                    {edu.isCurrent ? "Present" : formatDate(edu.endDate || "")}
                  </p>
                  {edu.description && (
                    <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-zinc-400">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(edu)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-[#0A0A0A]/80 hover:text-white"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => void handleDelete(edu.id)}
                    disabled={deleteEducation.isPending}
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
      {educationList.length === 0 && !isFormOpen && (
        <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
          <GraduationCap className="mx-auto h-10 w-10 text-zinc-500" strokeWidth={1} />
          <p className="mt-3 text-sm text-zinc-400">No education entries yet</p>
          <button
            onClick={handleStartAdd}
            className="mt-4 text-sm font-medium text-white underline-offset-4 hover:underline"
          >
            Add your first education
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="space-y-5 rounded-xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">
              {editingId ? "Edit Education" : "New Education"}
            </h3>
            <button
              onClick={handleCancel}
              className="rounded-lg p-1 text-zinc-400 transition-colors hover:text-white"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">
              Institution <span className="text-red-500">*</span>
            </label>
            <InstitutionAutocomplete
              value={formData.institutionCode}
              displayValue={formData.institution}
              onValueChange={handleInstitutionChange}
              placeholder="Search institution..."
              className="text-sm"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Degree <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData((p) => ({ ...p, degree: e.target.value }))}
                placeholder="Bachelor's"
                className="w-full rounded-lg border border-white/10 bg-[#0A0A0A]/80 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white">
                Field of Study <span className="text-red-500">*</span>
              </label>
              <CourseAutocomplete
                value={formData.courseCode}
                displayValue={formData.field}
                institutionCode={formData.institutionCode}
                onValueChange={handleCourseChange}
                placeholder={
                  formData.institutionCode ? "Select course..." : "Select institution first"
                }
                disabled={!formData.institutionCode}
                className="text-sm"
              />
            </div>
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
            <span className="text-sm text-zinc-400">Currently studying here</span>
          </label>

          <div>
            <label className="mb-2 block text-sm font-medium text-white">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Notable achievements, activities, or coursework..."
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
              onClick={() => void handleSave()}
              disabled={
                !formData.institution ||
                !formData.degree ||
                !formData.field ||
                !formData.startDate ||
                isSaving
              }
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
