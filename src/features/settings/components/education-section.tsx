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

interface FormData extends Partial<CreateEducationPayload> {
  institutionCode?: number | null;
  courseCode?: number | null;
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
        ? institution.siglaIes
          ? `${institution.siglaIes} - ${institution.nomeIes}`
          : institution.nomeIes
        : "",
      // Reset course when institution changes
      courseCode: null,
      field: "",
    }));
  };

  const handleCourseChange = (codigoCurso: number | null, course?: MecCourse) => {
    setFormData((prev) => ({
      ...prev,
      courseCode: codigoCurso,
      field: course?.nomeCurso || "",
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
          <div className="flex items-center gap-2">
            <GraduationCap className="text-pf-accent-fg h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs"> Education</span>
          </div>
          <p className="text-pf-fg-subtle mt-1 font-mono text-xs">
            {educationList.length} entr{educationList.length !== 1 ? "ies" : "y"} added
          </p>
        </div>
        {!isFormOpen && (
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg hover:bg-pf-accent-subtle flex items-center gap-2 border border-transparent px-3 py-1.5 font-mono text-sm transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            add_education
          </button>
        )}
      </div>

      {/* Education List */}
      {educationList.length > 0 && !isFormOpen && (
        <div className="space-y-3">
          {educationList.map((edu: Education) => (
            <div
              key={edu.id}
              className="border-pf-border-default bg-pf-canvas-subtle group border p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-pf-fg-default font-mono text-sm font-semibold">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-pf-fg-muted mt-0.5 flex items-center gap-2 font-mono text-xs">
                    <BookOpen className="h-3 w-3" />
                    {edu.institution}
                  </p>
                  <p className="text-pf-fg-subtle mt-1 flex items-center gap-1 font-mono text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDate(edu.startDate)} –{" "}
                    {edu.isCurrent ? "Present" : formatDate(edu.endDate || "")}
                  </p>
                  {edu.description && (
                    <p className="text-pf-fg-muted border-pf-border-default mt-2 border-t border-dashed pt-2 font-mono text-xs">
                      {edu.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleStartEdit(edu)}
                    className="text-pf-fg-muted hover:text-pf-accent-fg p-1.5 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    disabled={deleteEducation.isPending}
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
      {educationList.length === 0 && !isFormOpen && (
        <div className="border-pf-border-default border border-dashed p-8 text-center">
          <GraduationCap className="text-pf-fg-subtle mx-auto h-8 w-8" strokeWidth={1} />
          <p className="text-pf-fg-muted mt-2 font-mono text-sm">No education entries yet</p>
          <button
            onClick={handleStartAdd}
            className="text-pf-accent-fg mt-3 font-mono text-sm underline-offset-4 hover:underline"
          >
            Add your first education
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
          <div className="flex items-center justify-between">
            <span className="text-pf-accent-fg font-mono text-xs">
              <span className="opacity-60">{"//"}</span>{" "}
              {editingId ? "Edit education" : "New education"}
            </span>
            <button onClick={handleCancel} className="text-pf-fg-muted hover:text-pf-fg-default">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div>
            <label className="text-pf-fg-default mb-1 block font-mono text-xs">
              institution<span className="text-pf-danger-fg">*</span>
            </label>
            <InstitutionAutocomplete
              value={formData.institutionCode}
              displayValue={formData.institution}
              onValueChange={handleInstitutionChange}
              placeholder="Buscar instituição..."
              className="font-mono text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                degree<span className="text-pf-danger-fg">*</span>
              </label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData((p) => ({ ...p, degree: e.target.value }))}
                placeholder="Bachelor's"
                className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                field<span className="text-pf-danger-fg">*</span>
              </label>
              <CourseAutocomplete
                value={formData.courseCode}
                displayValue={formData.field}
                institutionCode={formData.institutionCode}
                onValueChange={handleCourseChange}
                placeholder={
                  formData.institutionCode
                    ? "Selecionar curso..."
                    : "Selecione a instituição primeiro"
                }
                disabled={!formData.institutionCode}
                className="font-mono text-sm"
              />
            </div>
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
            <span className="text-pf-fg-muted font-mono text-xs">Currently studying here</span>
          </label>

          <div>
            <label className="text-pf-fg-default mb-1 block font-mono text-xs">description</label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Notable achievements, activities, or coursework..."
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
              disabled={
                !formData.institution ||
                !formData.degree ||
                !formData.field ||
                !formData.startDate ||
                isSaving
              }
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
