/**
 * Personal Info Step
 *
 * Nielsen: Error prevention (validation), Help users recognize errors
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { User, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { PhoneInput } from "@/shared/components/ui";

export function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, goToNextStep, markStepComplete } = useOnboardingStore();

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

    if (touched.fullName && formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (touched.email) {
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    return newErrors;
  }, [formData, touched]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
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
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-pf-accent-fg font-mono text-sm">{`>`}</span>
          <h2 className="text-pf-fg-default text-xl font-bold">Personal Information</h2>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Basic info for your profile header
        </p>
      </div>

      {/* Code Comment */}
      <div className="text-pf-fg-subtle font-mono text-xs">
        <span className="text-gray-500">
          <span className="opacity-60">{"//"}</span> Required fields marked with *
        </span>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <User className="h-4 w-4" strokeWidth={1.5} />
            fullName<span className="text-pf-danger-fg">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            placeholder="John Doe"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.fullName ? "border-pf-danger-fg" : ""} `}
          />
          {errors.fullName && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Mail className="h-4 w-4" strokeWidth={1.5} />
            email<span className="text-pf-danger-fg">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="dev@example.com"
            className={`border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none ${errors.email ? "border-pf-danger-fg" : ""} `}
          />
          {errors.email && (
            <p className="text-pf-danger-fg mt-1 flex items-center gap-1 font-mono text-xs">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            phone<span className="text-pf-fg-subtle ml-1 text-xs">(optional)</span>
          </label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            countryFormat="BR"
            className="bg-pf-canvas-subtle"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-pf-fg-default mb-1.5 flex items-center gap-2 font-mono text-sm">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            location<span className="text-pf-fg-subtle ml-1 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="São Paulo, BR"
            className="border-pf-border-default bg-pf-canvas-subtle text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
