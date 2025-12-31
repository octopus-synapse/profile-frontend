/**
 * Review Step
 *
 * Nielsen: Visibility of system status, Error prevention
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type OnboardingStep, type Experience, type Skill } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { useSubmitOnboarding } from "../../hooks/use-onboarding-mutations";
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
      const payload = buildSubmissionPayload();

      // Use the proper hook which handles query invalidation
      await submitOnboarding.mutateAsync(payload);

      markStepComplete("review");
      goToNextStep();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : (err as { message?: string })?.message || "Something went wrong";
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
          <span className="text-cyan-400 font-mono text-sm">{`>`}</span>
          <h2 className="text-white text-xl font-bold">Review & Submit</h2>
        </div>
        <p className="text-zinc-400 mt-1 font-mono text-xs">
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
                section.complete ? "border-white/10" : "border-red-500/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {section.complete ? (
                    <CheckCircle2 className="text-emerald-500 h-4 w-4" strokeWidth={2} />
                  ) : (
                    <AlertCircle className="text-red-500 h-4 w-4" strokeWidth={2} />
                  )}
                  <Icon className="text-zinc-400 h-4 w-4" strokeWidth={1.5} />
                  <span className="text-white font-mono text-sm">{section.label}</span>
                  {section.optional && (
                    <span className="text-zinc-500 font-mono text-[10px]">(opt)</span>
                  )}
                </div>
                <button
                  onClick={() => setCurrentStep(section.id as OnboardingStep)}
                  className="text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
              {section.data && (
                <p className="text-zinc-400 mt-1 truncate pl-6 font-mono text-xs">
                  {typeof section.data === "string" ? section.data : null}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Preview */}
      <div className="border-white/10 bg-white/5 border p-4">
        <div className="text-zinc-500 mb-4 font-mono text-xs">
          <span className="opacity-60">{"//"}</span> Profile Preview
        </div>

        {personalInfo && professionalProfile && (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="border-white/10 border-b pb-4">
              <h3 className="text-white text-lg font-bold">{personalInfo.fullName}</h3>
              <p className="text-cyan-400 font-mono text-sm">{professionalProfile.jobTitle}</p>
              <div className="text-zinc-400 mt-1 flex flex-wrap gap-2 font-mono text-xs">
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
              <h4 className="text-white mb-1 font-mono text-xs font-semibold">Summary</h4>
              <p className="text-zinc-400 font-mono text-xs leading-relaxed">
                {professionalProfile.summary.length > 200
                  ? `${professionalProfile.summary.substring(0, 200)}...`
                  : professionalProfile.summary}
              </p>
            </div>

            {/* Experience */}
            {!noExperience && experiences.length > 0 && (
              <div>
                <h4 className="text-white mb-2 font-mono text-xs font-semibold">
                  Experience
                </h4>
                <div className="space-y-2">
                  {experiences.slice(0, 2).map((exp: Experience) => (
                    <div
                      key={exp.id}
                      className="text-zinc-400 flex items-center gap-2 font-mono text-xs"
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
                    <p className="text-zinc-500 font-mono text-xs">
                      +{experiences.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {!noSkills && skills.length > 0 && (
              <div>
                <h4 className="text-white mb-2 font-mono text-xs font-semibold">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 8).map((skill: Skill) => (
                    <span
                      key={skill.id}
                      className="bg-[#0A0A0A]/80 text-zinc-400 border-white/10 border px-1.5 py-0.5 font-mono text-[10px]"
                    >
                      {skill.name}
                    </span>
                  ))}
                  {skills.length > 8 && (
                    <span className="text-zinc-500 font-mono text-[10px]">
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
        <div className="border-red-500 bg-red-500/10 flex items-center gap-2 border p-3">
          <AlertCircle className="text-red-500 h-4 w-4" />
          <span className="text-red-500 font-mono text-sm">{error}</span>
        </div>
      )}

      {/* Warning if incomplete */}
      {!allRequiredComplete && (
        <div className="border-amber-500 bg-amber-500/10 flex items-center gap-2 border p-3">
          <AlertCircle className="text-amber-500 h-4 w-4" />
          <span className="text-amber-500 font-mono text-sm">
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
