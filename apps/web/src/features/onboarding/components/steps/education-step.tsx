/**
 * Education Step
 *
 * Nielsen: Flexibility and efficiency of use
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Education } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, Trash2, Calendar, Building } from "lucide-react";
import { nanoid } from "nanoid";
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

export function EducationStep() {
  const {
    education,
    noEducation,
    setNoEducation,
    addEducation,
    removeEducation,
    goToNextStep,
    markStepComplete,
  } = useOnboardingStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newEdu, setNewEdu] = useState<
    Partial<Education> & {
      institutionCode?: number | null;
      courseCode?: number | null;
      location?: string;
    }
  >({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    institutionCode: null,
    courseCode: null,
    location: "",
  });

  const handleInstitutionChange = (codigoIes: number | null, institution?: MecInstitution) => {
    setNewEdu((prev) => ({
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
    setNewEdu((prev) => ({
      ...prev,
      courseCode: codigoCurso,
      field: course?.nome || "",
      // Auto-fill degree from course grau if not already set
      degree: prev.degree || mapGrauToDegree(course?.grau ?? null),
    }));
  };

  const handleAddEducation = () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.field || !newEdu.startDate) return;

    addEducation({
      id: nanoid(),
      institution: newEdu.institution,
      degree: newEdu.degree,
      field: newEdu.field,
      startDate: newEdu.startDate,
      endDate: newEdu.isCurrent ? undefined : newEdu.endDate,
      isCurrent: newEdu.isCurrent || false,
    });

    setNewEdu({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      institutionCode: null,
      courseCode: null,
      location: "",
    });
    setIsAdding(false);
  };

  const handleToggleNoEducation = () => {
    setNoEducation(!noEducation);
  };

  const handleNext = () => {
    markStepComplete("education");
    goToNextStep();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return `${month}/${year}`;
  };

  const degreeOptions = [
    "High School",
    "Associate's",
    "Bachelor's",
    "Master's",
    "MBA",
    "Ph.D.",
    "Bootcamp",
    "Certificate",
    "Other",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Education</h2>
          <span className="bg-pf-canvas-inset text-pf-fg-subtle ml-2 px-2 py-0.5 font-mono text-xs">
            optional
          </span>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">Add your educational background</p>
      </div>

      {/* No Education Toggle */}
      <label className="border-pf-border-default bg-pf-canvas-subtle flex cursor-pointer items-center gap-3 border p-3">
        <input
          type="checkbox"
          checked={noEducation}
          onChange={handleToggleNoEducation}
          className="text-pf-accent-fg h-4 w-4"
        />
        <span className="text-pf-fg-muted font-mono text-sm">
          I&apos;m self-taught / no formal education to list
        </span>
      </label>

      {!noEducation && (
        <>
          {/* Education List */}
          {education.length > 0 && (
            <div className="space-y-3">
              <div className="text-pf-fg-subtle font-mono text-xs">
                <span className="opacity-60">{"//"}</span> {education.length} education
                {education.length > 1 ? " entries" : ""} added
              </div>

              {education.map((edu: Education) => (
                <div key={edu.id} className="border-pf-border-default border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-pf-fg-default font-mono text-sm font-semibold">
                        {edu.degree} in {edu.field}
                      </h4>
                      <p className="text-pf-fg-muted mt-0.5 flex items-center gap-2 font-mono text-xs">
                        <Building className="h-3 w-3" />
                        {edu.institution}
                      </p>
                      <p className="text-pf-fg-subtle mt-1 flex items-center gap-1 font-mono text-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(edu.startDate)} -{" "}
                        {edu.isCurrent ? "Present" : formatDate(edu.endDate || "")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeEducation(edu.id)}
                      className="text-pf-danger-fg hover:bg-pf-danger-subtle p-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Education Form */}
          {isAdding ? (
            <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
              <div className="text-pf-accent-fg font-mono text-xs">
                <span className="opacity-60">{"//"}</span> New education
              </div>

              <div>
                <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                  institution<span className="text-pf-danger-fg">*</span>
                </label>
                <InstitutionAutocomplete
                  value={newEdu.institutionCode}
                  displayValue={newEdu.institution}
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
                  <select
                    value={newEdu.degree}
                    onChange={(e) =>
                      setNewEdu((prev: Partial<Education>) => ({ ...prev, degree: e.target.value }))
                    }
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
                  >
                    <option value="">Select degree</option>
                    {degreeOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                    field<span className="text-pf-danger-fg">*</span>
                  </label>
                  <CourseAutocomplete
                    value={newEdu.courseCode}
                    displayValue={newEdu.field}
                    institutionCode={newEdu.institutionCode}
                    onValueChange={handleCourseChange}
                    placeholder={
                      newEdu.institutionCode
                        ? "Selecionar curso..."
                        : "Selecione a instituição primeiro"
                    }
                    disabled={!newEdu.institutionCode}
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
                    value={newEdu.startDate}
                    onChange={(e) =>
                      setNewEdu((prev: Partial<Education>) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-pf-fg-default mb-1 block font-mono text-xs">endDate</label>
                  <input
                    type="date"
                    value={newEdu.endDate}
                    onChange={(e) =>
                      setNewEdu((prev: Partial<Education>) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    disabled={newEdu.isCurrent}
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newEdu.isCurrent}
                  onChange={(e) =>
                    setNewEdu((prev: Partial<Education>) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                    }))
                  }
                  className="text-pf-accent-fg h-4 w-4"
                />
                <span className="text-pf-fg-muted font-mono text-xs">Currently studying</span>
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-pf-fg-muted hover:text-pf-fg-default px-3 py-1.5 font-mono text-sm transition-colors"
                >
                  cancel
                </button>
                <button
                  onClick={handleAddEducation}
                  disabled={
                    !newEdu.institution || !newEdu.degree || !newEdu.field || !newEdu.startDate
                  }
                  className="bg-pf-canvas-emphasis text-pf-fg-on-emphasis px-3 py-1.5 font-mono text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="border-pf-border-default text-pf-fg-muted hover:border-pf-accent-fg hover:text-pf-accent-fg flex w-full items-center justify-center gap-2 border border-dashed py-3 font-mono text-sm transition-colors"
            >
              <Plus className="h-4 w-4" strokeWidth={1.5} />
              Add education
            </button>
          )}
        </>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} showSkip={true} canProceed={true} />
    </div>
  );
}
