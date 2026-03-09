/**
 * Review Step
 *
 * Nielsen: Visibility of system status, Error prevention
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type OnboardingStep, type Experience, type Skill } from "../stores";
import { StepNavigation } from "../step-navigation";
import { useSubmitOnboarding } from "../hooks/use-onboarding-mutations";
import { useOnboardingSync } from "../hooks/use-onboarding-sync";
import { isApiError } from "@/shared/types/errors";
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
  AtSign,
} from "lucide-react";

export function ReviewStep() {
  const {
    personalInfo,
    username,
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

  const submitOnboarding = useSubmitOnboarding();
  const { saveToBackend } = useOnboardingSync();
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
      id: "username",
      label: "Username",
      icon: AtSign,
      complete: !!username && username.length >= 3 && username.length <= 30,
      data: username ? `@${username}` : null,
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
    setError(null);

    if (!allRequiredComplete) {
      setError("Please complete all required sections before submitting");
      return;
    }

    // Validate username is not null
    if (!username) {
      setError("Username is required. Please go back to the username step.");
      return;
    }

    // Validate skills requirement
    if (!noSkills && skills.length === 0) {
      setError("Please add at least one skill or mark that you're still developing skills.");
      return;
    }

    try {
      // Save current progress to backend before submitting
      // This ensures we don't lose progress if submission fails
      try {
        await saveToBackend();
        console.log("Progress saved to backend before submission");
      } catch (saveError) {
        console.warn("Failed to save progress before submission:", saveError);
        // Continue with submission even if save fails
      }

      const payload = buildSubmissionPayload();

      console.log("Submitting onboarding payload:", payload);

      // Use the proper hook which handles query invalidation
      const result = await submitOnboarding.mutateAsync(payload);

      console.log("Onboarding submission result:", result);

      markStepComplete("review");
      goToNextStep();
    } catch (err) {
      console.error("Onboarding submission error:", err);

      // Extract better error message from ApiError structure
      let errorMessage = "Something went wrong. Please try again.";

      if (isApiError(err)) {
        // Use message from ApiError structure
        errorMessage = err.message;

        // Handle specific error codes with user-friendly messages
        if (err.code === "CONFLICT" || err.statusCode === 409) {
          errorMessage =
            "Username is already taken. Please go back and choose a different username.";
        } else if (err.code === "VALIDATION_ERROR" || err.statusCode === 400) {
          // Try to extract field-specific errors
          if (err.details && typeof err.details === "object") {
            const fieldErrors = Object.values(err.details).flat();
            if (fieldErrors.length > 0 && typeof fieldErrors[0] === "string") {
              errorMessage = fieldErrors[0];
            } else {
              errorMessage = "Invalid data. Please check all required fields and try again.";
            }
          } else {
            errorMessage = "Invalid data. Please check all required fields and try again.";
          }
        } else if (err.code === "UNAUTHORIZED" || err.statusCode === 401) {
          errorMessage = "Session expired. Please refresh the page and try again.";
        } else if (err.code === "INTERNAL_ERROR" || err.statusCode === 500) {
          errorMessage = "Server error. Please try again in a moment.";
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (err && typeof err === "object" && "message" in err) {
        errorMessage = String(err.message);
      }

      setError(errorMessage);
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
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Review & Submit</h2>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
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
              className={`border p-3 ${section.complete ? "border-white/10" : "border-red-500/50"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {section.complete ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2} />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" strokeWidth={2} />
                  )}
                  <Icon className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                  <span className="font-mono text-sm text-white">{section.label}</span>
                  {section.optional && (
                    <span className="font-mono text-[10px] text-zinc-500">(opt)</span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep(section.id as OnboardingStep)}
                  className="text-zinc-500 transition-colors hover:text-cyan-400"
                >
                  <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              {section.data && (
                <p className="mt-1 truncate pl-6 font-mono text-xs text-zinc-400">
                  {typeof section.data === "string" ? section.data : null}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Preview */}
      <div className="border border-white/10 bg-white/5 p-4">
        <div className="mb-4 font-mono text-xs text-zinc-500">
          <span className="opacity-60">{"//"}</span> Profile Preview
        </div>

        {personalInfo && professionalProfile && (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">{personalInfo.fullName}</h3>
              <p className="font-mono text-sm text-cyan-400">{professionalProfile.jobTitle}</p>
              <div className="mt-1 flex flex-wrap gap-2 font-mono text-xs text-zinc-400">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.location && (
                  <>
                    <span className="text-white/10">•</span>
                    <span>{personalInfo.location}</span>
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="mb-1 font-mono text-xs font-semibold text-white">Summary</h4>
              <p className="font-mono text-xs leading-relaxed text-zinc-400">
                {professionalProfile.summary.length > 200
                  ? `${professionalProfile.summary.substring(0, 200)}...`
                  : professionalProfile.summary}
              </p>
            </div>

            {/* Experience */}
            {!noExperience && experiences.length > 0 && (
              <div>
                <h4 className="mb-2 font-mono text-xs font-semibold text-white">Experience</h4>
                <div className="space-y-2">
                  {experiences.slice(0, 2).map((exp: Experience) => (
                    <div
                      key={exp.id}
                      className="flex items-center gap-2 font-mono text-xs text-zinc-400"
                    >
                      <Calendar className="h-3 w-3" />
                      <span className="text-white">{exp.position}</span>
                      <span>@</span>
                      <span>{exp.company}</span>
                      <span className="text-zinc-500">
                        ({formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")})
                      </span>
                    </div>
                  ))}
                  {experiences.length > 2 && (
                    <p className="font-mono text-xs text-zinc-500">
                      +{experiences.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {!noSkills && skills.length > 0 && (
              <div>
                <h4 className="mb-2 font-mono text-xs font-semibold text-white">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 8).map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className="border border-white/10 bg-[#0A0A0A]/80 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {skills.length > 8 && (
                    <span className="font-mono text-[10px] text-zinc-500">
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
        <div className="flex items-center gap-2 border border-red-500 bg-red-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="font-mono text-sm text-red-500">{error}</span>
        </div>
      )}

      {/* Warning if incomplete */}
      {!allRequiredComplete && (
        <div className="flex items-center gap-2 border border-amber-500 bg-amber-500/10 p-3">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <span className="font-mono text-sm text-amber-500">
            Please complete all required sections before submitting
          </span>
        </div>
      )}

      {/* Navigation */}
      <StepNavigation
        onNext={handleSubmit}
        nextLabel="create profile"
        isLoading={submitOnboarding.isPending}
        canProceed={allRequiredComplete}
      />
    </div>
  );
}
