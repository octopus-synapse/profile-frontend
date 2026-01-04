/**
 * Education Section - Refactored
 * Manage education entries
 */

"use client";

import { GraduationCap, Calendar, BookOpen } from "lucide-react";
import { useEducation, useCreateEducation, useUpdateEducation, useDeleteEducation } from "../hooks";
import type { Education, CreateEducationPayload } from "../types";
import { formatDate } from "@/shared/utils/form-helpers";
import { CrudSection, ItemActions } from "@/shared/components/crud-section";
import { TextInput, DateInput, TextArea, Checkbox } from "@/shared/components/ui/form-input";
import {
  InstitutionAutocomplete,
  CourseAutocomplete,
  type MecInstitution,
  type MecCourse,
} from "@/features/mec";

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

  const educationList = data?.data || [];

  return (
    <CrudSection
      title="Education"
      emptyIcon={GraduationCap}
      emptyMessage="No education entries yet"
      emptyActionLabel="Add your first education"
      addButtonLabel="Add Education"
      itemName="education"
      items={educationList}
      isLoading={isLoading}
      emptyFormData={emptyEducation}
      createMutation={useCreateEducation()}
      updateMutation={useUpdateEducation()}
      deleteMutation={useDeleteEducation()}
      prepareFormData={(edu) => ({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        startDate: edu.startDate,
        endDate: edu.endDate || "",
        isCurrent: edu.isCurrent,
        description: edu.description || "",
      })}
      preparePayload={(formData) => ({
        institution: formData.institution!,
        degree: formData.degree!,
        field: formData.field!,
        startDate: formData.startDate!,
        endDate: formData.isCurrent ? null : formData.endDate || null,
        isCurrent: formData.isCurrent || false,
        description: formData.description || null,
      })}
      validateForm={(formData) =>
        !!(formData.institution && formData.degree && formData.field && formData.startDate)
      }
      renderItem={(edu, onEdit, onDelete) => (
        <div className="group rounded-xl border border-white/10 bg-white/5 p-5">
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
                {formatDate(edu.startDate)} – {edu.isCurrent ? "Present" : formatDate(edu.endDate || "")}
              </p>
              {edu.description && (
                <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-zinc-400">
                  {edu.description}
                </p>
              )}
            </div>
            <ItemActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      )}
      renderForm={(formData, setFormData) => {
        const handleInstitutionChange = (codigoIes: number | null, institution?: MecInstitution) => {
          setFormData((prev: any) => ({
            ...prev,
            institutionCode: codigoIes,
            institution: institution
              ? institution.sigla
                ? `${institution.sigla} - ${institution.nome}`
                : institution.nome
              : "",
            location:
              institution?.municipio && institution?.uf
                ? `${institution.municipio}, ${institution.uf}`
                : institution?.uf || "",
            courseCode: null,
            field: "",
          }));
        };

        const handleCourseChange = (codigoCurso: number | null, course?: MecCourse) => {
          setFormData((prev: any) => ({
            ...prev,
            courseCode: codigoCurso,
            field: course?.nome || "",
            degree: prev.degree || mapGrauToDegree(course?.grau ?? null),
          }));
        };

        return (
          <>
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
              <TextInput
                label="Degree"
                required
                value={formData.degree}
                onChange={(e) => setFormData((p: any) => ({ ...p, degree: e.target.value }))}
                placeholder="Bachelor's"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <CourseAutocomplete
                  value={formData.courseCode}
                  displayValue={formData.field}
                  institutionCode={formData.institutionCode}
                  onValueChange={handleCourseChange}
                  placeholder={formData.institutionCode ? "Select course..." : "Select institution first"}
                  disabled={!formData.institutionCode}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <DateInput
                label="Start Date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData((p: any) => ({ ...p, startDate: e.target.value }))}
              />

              <DateInput
                label="End Date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData((p: any) => ({ ...p, endDate: e.target.value }))}
                disabled={formData.isCurrent}
              />
            </div>

            <Checkbox
              label="Currently studying here"
              checked={formData.isCurrent}
              onChange={(e) => setFormData((p: any) => ({ ...p, isCurrent: e.target.checked }))}
            />

            <TextArea
              label="Description"
              value={formData.description || ""}
              onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))}
              placeholder="Notable achievements, activities, or coursework..."
            />
          </>
        );
      }}
    />
  );
}
