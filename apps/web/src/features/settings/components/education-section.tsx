/**
 * Education Section
 * Manage education entries
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
    if (!formData.institution || !formData.degree || !formData.field || !formData.startDate) return;

    const payload: CreateEducationPayload = {
      institution: formData.institution,
      degree: formData.degree,
      field: formData.field,
      startDate: formData.startDate,
      endDate: formData.isCurrent ? null : formData.endDate || null,
      isCurrent: formData.isCurrent || false,
      description: formData.description || null,
    };

    try {
      if (editingId) {
        await updateEducation.mutateAsync({ id: editingId, data: payload });
      } else {
        await createEducation.mutateAsync(payload);
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save education:", error);
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
        <Loader2 className="text-pf-fg-muted h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-pf-fg-default text-lg font-semibold">Education</h2>
          <p className="text-pf-fg-muted mt-1 text-sm">
            {educationList.length} entr{educationList.length !== 1 ? "ies" : "y"} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default hover:bg-pf-canvas-subtle flex items-center gap-2 rounded-lg border border-pf-border-default px-4 py-2 text-sm font-medium transition-colors"
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
            <div
              key={edu.id}
              className="border-pf-border-default bg-pf-canvas-subtle group rounded-xl border p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-pf-fg-default text-base font-semibold">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-pf-fg-muted mt-1 flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    {edu.institution}
                  </p>
                  <p className="text-pf-fg-subtle mt-2 flex items-center gap-1.5 text-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate || "")}
                  </p>
                  {edu.description && (
                    <p className="text-pf-fg-muted border-pf-border-default mt-3 border-t pt-3 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(edu)}
                    className="text-pf-fg-muted hover:text-pf-fg-default rounded-lg p-2 transition-colors hover:bg-pf-canvas-overlay"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    disabled={deleteEducation.isPending}
                    className="text-pf-fg-muted hover:text-pf-danger-fg rounded-lg p-2 transition-colors hover:bg-pf-canvas-overlay disabled:opacity-50"
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
        <div className="border-pf-border-default rounded-xl border border-dashed p-10 text-center">
          <GraduationCap className="text-pf-fg-subtle mx-auto h-10 w-10" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-3 text-sm">No education entries yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-fg-default mt-4 text-sm font-medium underline-offset-4 hover:underline"
          >
            Add your first education
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-border-default bg-pf-canvas-subtle space-y-5 rounded-xl border p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-pf-fg-default text-base font-semibold">
              {editingId ? "Edit Education" : "New Education"}
            </h3>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default rounded-lg p-1 transition-colors">
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <label className="text-pf-fg-default mb-2 block text-sm font-medium">
              Institution <span className="text-pf-danger-fg">*</span>
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
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                Degree <span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData((p) => ({ ...p, degree: e.target.value }))}
                placeholder="Bachelor's"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                Field of Study <span className="text-pf-danger-fg">*</span>
              </label>
              <CourseAutocomplete
                value={formData.courseCode}
                displayValue={formData.field}
                institutionCode={formData.institutionCode}
                onValueChange={handleCourseChange}
                placeholder={
                  formData.institutionCode
                    ? "Select course..."
                    : "Select institution first"
                }
                disabled={!formData.institutionCode}
                className="text-sm"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">
                Start Date <span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-2 block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                disabled={formData.isCurrent}
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-fg-muted w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData((p) => ({ ...p, isCurrent: e.target.checked }))}
              className="h-4 w-4 rounded border-pf-border-default"
            />
            <span className="text-pf-fg-muted text-sm">Currently studying here</span>
          </label>

          <div>
            <label className="text-pf-fg-default mb-2 block text-sm font-medium">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Notable achievements, activities, or coursework..."
              rows={3}
              className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-fg-muted w-full resize-none rounded-lg border px-4 py-2.5 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="text-pf-fg-muted hover:text-pf-fg-default px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={
                !formData.institution ||
                !formData.degree ||
                !formData.field ||
                !formData.startDate ||
                isSaving
              }
              className="bg-pf-fg-default text-pf-canvas-default flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
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
