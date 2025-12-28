/**
 * Professional Profile Step
 *
 * Nielsen: Match between system and real world (familiar labels)
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Briefcase, FileText, Linkedin, Github, Globe, AlertCircle } from "lucide-react";

export function ProfessionalProfileStep() {
  const { professionalProfile, setProfessionalProfile, goToNextStep, markStepComplete } =
    useOnboardingStore();

  const [formData, setFormData] = useState({
    jobTitle: professionalProfile?.jobTitle || "",
    summary: professionalProfile?.summary || "",
    linkedin: professionalProfile?.linkedin || "",
    github: professionalProfile?.github || "",
    website: professionalProfile?.website || "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Character count for summary
  const summaryLength = formData.summary.length;
  const minSummary = 50;
  const maxSummary = 2000;

  // Validate using useMemo instead of useEffect + setState
  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.jobTitle && formData.jobTitle.length < 2) {
      newErrors.jobTitle = "Job title must be at least 2 characters";
    }

    if (touched.summary) {
      if (summaryLength < minSummary) {
        newErrors.summary = `Summary must be at least ${minSummary} characters`;
      } else if (summaryLength > maxSummary) {
        newErrors.summary = `Summary must be less than ${maxSummary} characters`;
      }
    }

    // URL validations
    const urlFields = ["linkedin", "github", "website"] as const;
    urlFields.forEach((field) => {
      if (touched[field] && formData[field]) {
        try {
          new URL(formData[field]);
        } catch {
          newErrors[field] = "Invalid URL format";
        }
      }
    });

    return newErrors;
  }, [formData, touched, summaryLength]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    setTouched({ jobTitle: true, summary: true, linkedin: true, github: true, website: true });

    if (formData.jobTitle.length < 2 || summaryLength < minSummary || summaryLength > maxSummary) {
      return;
    }

    setProfessionalProfile({
      jobTitle: formData.jobTitle,
      summary: formData.summary,
      linkedin: formData.linkedin || undefined,
      github: formData.github || undefined,
      website: formData.website || undefined,
    });
    markStepComplete("professional-profile");
    goToNextStep();
  };

  const canProceed =
    formData.jobTitle.length >= 2 && summaryLength >= minSummary && summaryLength <= maxSummary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Professional Profile</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Tell us about your career and online presence
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Briefcase className="h-4 w-4" strokeWidth={1.5} />
            jobTitle<span className="text-pf-danger-fg">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            onBlur={() => handleBlur("jobTitle")}
            placeholder="Senior Software Engineer"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.jobTitle ? "border-pf-danger-fg" : ""} `}
          />
          {errors.jobTitle && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Summary */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <FileText className="h-4 w-4" strokeWidth={1.5} />
            summary<span className="text-pf-danger-fg">*</span>
          </label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            onBlur={() => handleBlur("summary")}
            placeholder="Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud infrastructure..."
            rows={4}
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full resize-none border px-3 py-2 font-mono text-sm focus:outline-none ${errors.summary ? "border-pf-danger-fg" : ""} `}
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.summary ? (
              <p className="text-pf-danger-fg flex items-center gap-1 font-mono text-xs">
                <AlertCircle className="h-3 w-3" />
                {errors.summary}
              </p>
            ) : (
              <span className="text-pf-fg-subtle font-mono text-xs">min {minSummary} chars</span>
            )}
            <span
              className={`font-mono text-xs ${
                summaryLength < minSummary
                  ? "text-pf-attention-fg"
                  : summaryLength > maxSummary
                    ? "text-pf-danger-fg"
                    : "text-pf-success-fg"
              }`}
            >
              {summaryLength}/{maxSummary}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-pf-border-muted flex items-center gap-3 border-t pt-4">
          <span className="text-pf-fg-subtle font-mono text-xs">
            <span className="opacity-60">{"//"}</span> Social links (optional)
          </span>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Linkedin className="h-4 w-4" strokeWidth={1.5} />
            linkedin
          </label>
          <input
            type="url"
            value={formData.linkedin}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            onBlur={() => handleBlur("linkedin")}
            placeholder="https://linkedin.com/in/username"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.linkedin ? "border-pf-danger-fg" : ""} `}
          />
          {errors.linkedin && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.linkedin}
            </p>
          )}
        </div>

        {/* GitHub */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Github className="h-4 w-4" strokeWidth={1.5} />
            github
          </label>
          <input
            type="url"
            value={formData.github}
            onChange={(e) => handleChange("github", e.target.value)}
            onBlur={() => handleBlur("github")}
            placeholder="https://github.com/username"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.github ? "border-pf-danger-fg" : ""} `}
          />
          {errors.github && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.github}
            </p>
          )}
        </div>

        {/* Website */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            website
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => handleChange("website", e.target.value)}
            onBlur={() => handleBlur("website")}
            placeholder="https://yoursite.dev"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.website ? "border-pf-danger-fg" : ""} `}
          />
          {errors.website && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.website}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
