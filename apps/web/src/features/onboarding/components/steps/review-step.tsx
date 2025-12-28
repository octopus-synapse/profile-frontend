/**
 * Review Step
 *
 * Nielsen: Visibility of system status, Error prevention
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type OnboardingStep, type Experience, type Skill } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { httpClient } from "@/shared/lib/http-client";
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Palette,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Building,
  Calendar,
} from "lucide-react";

export function ReviewStep() {
  const {
    personalInfo,
    professionalProfile,
    experiences,
    noExperience,
    education,
    noEducation,
    skills,
    noSkills,
    languages,
    templateSelection,
    setCurrentStep,
    goToNextStep,
    markStepComplete,
    buildSubmissionPayload,
  } = useOnboardingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check what's complete
  const sections = [
    {
      id: "personal-info",
      label: "Personal Info",
      icon: User,
      complete: !!personalInfo?.fullName && !!personalInfo?.email,
      data: personalInfo,
    },
    {
      id: "professional-profile",
      label: "Professional Profile",
      icon: Briefcase,
      complete: !!professionalProfile?.jobTitle && !!professionalProfile?.summary,
      data: professionalProfile,
    },
    {
      id: "experience",
      label: "Experience",
      icon: Building,
      complete: true, // Optional
      data: noExperience ? "No experience listed" : `${experiences.length} position(s)`,
      optional: true,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      complete: true, // Optional
      data: noEducation ? "No education listed" : `${education.length} entry(ies)`,
      optional: true,
    },
    {
      id: "skills",
      label: "Skills",
      icon: Code,
      complete: noSkills || skills.length > 0,
      data: noSkills ? "Still developing skills" : `${skills.length} skill(s)`,
    },
    {
      id: "languages",
      label: "Languages",
      icon: Globe,
      complete: true, // Optional
      data: languages.length > 0 ? `${languages.length} language(s)` : "None listed",
      optional: true,
    },
    {
      id: "template",
      label: "Theme",
      icon: Palette,
      complete: !!templateSelection?.palette,
      data: templateSelection?.palette ? `Palette: ${templateSelection.palette}` : null,
    },
  ];

  const allRequiredComplete = sections.filter((s) => !s.optional).every((s) => s.complete);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = buildSubmissionPayload();

      // Call the backend API via httpClient (includes auth token)
      await httpClient.post("/onboarding", payload);

      markStepComplete("review");
      goToNextStep();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Something went wrong";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month] = dateStr.split("-");
    return `${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Review & Submit</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Review your information before creating your profile
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-2 sm:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className={`border p-3 ${
                section.complete ? "border-pf-border-default" : "border-pf-danger-fg/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {section.complete ? (
                    <CheckCircle2 className="text-pf-success-fg h-4 w-4" strokeWidth={2} />
                  ) : (
                    <AlertCircle className="text-pf-danger-fg h-4 w-4" strokeWidth={2} />
                  )}
                  <Icon className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
                  <span className="text-pf-fg-default font-mono text-sm">{section.label}</span>
                  {section.optional && (
                    <span className="text-pf-fg-subtle font-mono text-[10px]">(opt)</span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep(section.id as OnboardingStep)}
                  className="text-pf-fg-subtle hover:text-pf-accent-fg transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              {section.data && (
                <p className="text-pf-fg-muted mt-1 truncate pl-6 font-mono text-xs">
                  {typeof section.data === "string" ? section.data : null}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Preview */}
      <div className="border-pf-border-default bg-pf-canvas-subtle border p-4">
        <div className="text-pf-fg-subtle mb-4 font-mono text-xs">
          <span className="opacity-60">{"//"}</span> Profile Preview
        </div>

        {personalInfo && professionalProfile && (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="border-pf-border-muted border-b pb-4">
              <h3 className="text-pf-fg-default text-lg font-bold">{personalInfo.fullName}</h3>
              <p className="text-pf-accent-fg font-mono text-sm">{professionalProfile.jobTitle}</p>
              <div className="text-pf-fg-muted mt-1 flex flex-wrap gap-2 font-mono text-xs">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.location && (
                  <>
                    <span className="text-pf-border-default">•</span>
                    <span>{personalInfo.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-pf-fg-default mb-1 font-mono text-xs font-semibold">Summary</h4>
              <p className="text-pf-fg-muted font-mono text-xs leading-relaxed">
                {professionalProfile.summary.length > 200
                  ? `${professionalProfile.summary.substring(0, 200)}...`
                  : professionalProfile.summary}
              </p>
            </div>

            {/* Experience */}
            {!noExperience && experiences.length > 0 && (
              <div>
                <h4 className="text-pf-fg-default mb-2 font-mono text-xs font-semibold">
                  Experience
                </h4>
                <div className="space-y-2">
                  {experiences.slice(0, 2).map((exp: Experience) => (
                    <div
                      key={exp.id}
                      className="text-pf-fg-muted flex items-center gap-2 font-mono text-xs"
                    >
                      <Calendar className="h-3 w-3" />
                      <span className="text-pf-fg-default">{exp.position}</span>
                      <span>@</span>
                      <span>{exp.company}</span>
                      <span className="text-pf-fg-subtle">
                        ({formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")})
                      </span>
                    </div>
                  ))}
                  {experiences.length > 2 && (
                    <p className="text-pf-fg-subtle font-mono text-xs">
                      +{experiences.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {!noSkills && skills.length > 0 && (
              <div>
                <h4 className="text-pf-fg-default mb-2 font-mono text-xs font-semibold">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 8).map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className="bg-pf-canvas-overlay text-pf-fg-muted border-pf-border-default border px-1.5 py-0.5 font-mono text-[10px]"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {skills.length > 8 && (
                    <span className="text-pf-fg-subtle font-mono text-[10px]">
                      +{skills.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="border-pf-danger-fg bg-pf-danger-subtle flex items-center gap-2 border p-3">
          <AlertCircle className="text-pf-danger-fg h-4 w-4" />
          <span className="text-pf-danger-fg font-mono text-sm">{error}</span>
        </div>
      )}

      {/* Warning if incomplete */}
      {!allRequiredComplete && (
        <div className="border-pf-attention-fg bg-pf-attention-subtle flex items-center gap-2 border p-3">
          <AlertCircle className="text-pf-attention-fg h-4 w-4" />
          <span className="text-pf-attention-fg font-mono text-sm">
            Please complete all required sections before submitting
          </span>
        </div>
      )}

      {/* Navigation */}
      <StepNavigation
        onNext={handleSubmit}
        nextLabel="create profile"
        isLoading={isSubmitting}
        canProceed={allRequiredComplete}
      />
    </div>
  );
}
