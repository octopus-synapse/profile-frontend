/**
 * Personal Info Step
 *
 * Nielsen: Error prevention (validation), Help users recognize errors
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { SaveIndicator } from "../save-indicator";
import { useOnboardingSync } from "../../hooks/use-onboarding-sync";
import { User, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { PhoneInput } from "@/shared/components/ui";
import { PhoneSchema, EmailSchema, FullNameSchema } from "@octopus-synapse/profile-contracts";

export function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, goToNextStep, markStepComplete } = useOnboardingStore();
  const { isSaving, lastSavedAt, saveError, saveToBackend } = useOnboardingSync();

  const [formData, setFormData] = useState({
    fullName: personalInfo?.fullName || "",
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    location: personalInfo?.location || "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate using useMemo instead of useEffect + setState
  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.fullName) {
      const nameResult = FullNameSchema.safeParse(formData.fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.errors[0]?.message || "Invalid name";
      }
    }

    if (touched.email) {
      const emailResult = EmailSchema.safeParse(formData.email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.errors[0]?.message || "Invalid email";
      }
    }

    if (touched.phone && formData.phone) {
      const phoneResult = PhoneSchema.safeParse(formData.phone);
      if (!phoneResult.success) {
        newErrors.phone = phoneResult.error.errors[0]?.message || "Invalid phone";
      }
    }

    return newErrors;
  }, [formData, touched]);

  const handleChange = (field: string, value: string) => {
    let processedValue = value;

    // Apply transformations based on field type
    if (field === "email") {
      processedValue = value.toLowerCase();
    } else if (field === "phone") {
      // Filter out invalid characters (letters), keep +, digits, spaces, dashes, parens
      processedValue = value.replace(/[^\d+\s()-]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Persist to store immediately
    setPersonalInfo({
      fullName: field === "fullName" ? processedValue : formData.fullName,
      email: field === "email" ? processedValue : formData.email,
      phone: field === "phone" ? processedValue : formData.phone || undefined,
      location: field === "location" ? processedValue : formData.location || undefined,
    });
  };

  const handleBlur = (field: string) => {
    // Apply transformations on blur
    const originalValue = formData[field as keyof typeof formData];
    let processedValue = originalValue;

    if (field === "email" || field === "fullName") {
      processedValue = originalValue.trim();
    }

    if (processedValue !== originalValue) {
      setFormData((prev) => ({ ...prev, [field]: processedValue }));
      setPersonalInfo({
        fullName: field === "fullName" ? processedValue : formData.fullName,
        email: field === "email" ? processedValue : formData.email,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
      });
    }

    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    // Touch all fields to show errors
    setTouched({ fullName: true, email: true, phone: true, location: true });

    // Validate
    if (
      formData.fullName.length < 2 ||
      !formData.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      return;
    }

    // Save and proceed
    setPersonalInfo({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || undefined,
      location: formData.location || undefined,
    });
    markStepComplete("personal-info");
    goToNextStep();
  };

  const canProceed =
    formData.fullName.length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  return (
    <div className="space-y-6">
      {/* Header with Save Indicator */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-cyan-400">{`>`}</span>
            <h2 className="text-xl font-bold text-white">Personal Information</h2>
          </div>
          <SaveIndicator
            isSaving={isSaving}
            lastSavedAt={lastSavedAt}
            error={saveError}
            onRetry={saveToBackend}
          />
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">Basic info for your profile header</p>
      </div>

      {/* Code Comment */}
      <div className="font-mono text-xs text-zinc-500">
        <span className="text-gray-500">
          <span className="opacity-60">{"//"}</span> Required fields marked with *
        </span>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
            <User className="h-4 w-4" strokeWidth={1.5} />
            fullName<span className="text-red-500">*</span>
          </label>
          <input
            id="fullName-input"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("email-input")?.focus();
              }
            }}
            placeholder="John Doe"
            aria-label="Full name"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "fullName-error" : undefined}
            aria-required="true"
            className={`w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none ${errors.fullName ? "border-red-500" : ""} `}
          />
          {errors.fullName && (
            <p
              id="fullName-error"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            email<span className="text-red-500">*</span>
          </label>
          <input
            id="email-input"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("phone-input")?.focus();
              }
            }}
            placeholder="dev@example.com"
            aria-label="Email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-required="true"
            className={`w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none ${errors.email ? "border-red-500" : ""} `}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-red-500"
            >
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            phone<span className="ml-1 text-xs text-zinc-500">(optional)</span>
          </label>
          <PhoneInput
            id="phone-input"
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                document.getElementById("location-input")?.focus();
              }
            }}
            countryFormat="BR"
            className="bg-white/5"
            aria-label="Phone"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            location<span className="ml-1 text-xs text-zinc-500">(optional)</span>
          </label>
          <input
            id="location-input"
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="São Paulo, BR"
            aria-label="Location"
            className="w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
