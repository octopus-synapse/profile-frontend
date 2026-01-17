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
import {
  EmailSchema,
  FullNameSchema,
  PhoneSchema,
  UserLocationSchema,
} from "@octopus-synapse/profile-contracts";

export function PersonalInfoStep() {
  const { personalInfo, setPersonalInfo, goToNextStep, markStepComplete } = useOnboardingStore();

  const [formData, setFormData] = useState({
    fullName: personalInfo?.fullName || "",
    email: personalInfo?.email || "",
    phone: personalInfo?.phone || "",
    location: personalInfo?.location || "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate using contract schemas
  const errors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (touched.fullName) {
      const nameResult = FullNameSchema.safeParse(formData.fullName);
      if (!nameResult.success) {
        newErrors.fullName = nameResult.error.issues[0]?.message || "Invalid name";
      }
    }

    if (touched.email) {
      const emailResult = EmailSchema.safeParse(formData.email);
      if (!emailResult.success) {
        newErrors.email = emailResult.error.issues[0]?.message || "Invalid email";
      }
    }

    if (touched.phone && formData.phone) {
      const phoneResult = PhoneSchema.safeParse(formData.phone);
      if (!phoneResult.success) {
        newErrors.phone = phoneResult.error.issues[0]?.message || "Invalid phone";
      }
    }

    if (touched.location && formData.location) {
      const locationResult = UserLocationSchema.safeParse(formData.location);
      if (!locationResult.success) {
        newErrors.location = locationResult.error.issues[0]?.message || "Invalid location";
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

    // Validate using contract schemas
    const nameResult = FullNameSchema.safeParse(formData.fullName);
    const emailResult = EmailSchema.safeParse(formData.email);
    const phoneResult = formData.phone ? PhoneSchema.safeParse(formData.phone) : { success: true };
    const locationResult = formData.location
      ? UserLocationSchema.safeParse(formData.location)
      : { success: true };

    if (
      !nameResult.success ||
      !emailResult.success ||
      !phoneResult.success ||
      !locationResult.success
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

  const canProceed = useMemo(() => {
    const nameResult = FullNameSchema.safeParse(formData.fullName);
    const emailResult = EmailSchema.safeParse(formData.email);
    return nameResult.success && emailResult.success;
  }, [formData.fullName, formData.email]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Personal Information</h2>
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
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            onBlur={() => handleBlur("fullName")}
            placeholder="John Doe"
            className={`w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none ${errors.fullName ? "border-red-500" : ""} `}
          />
          {errors.fullName && (
            <p className="mt-1 flex items-center gap-1 font-mono text-xs text-red-500">
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
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            placeholder="dev@example.com"
            className={`w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none ${errors.email ? "border-red-500" : ""} `}
          />
          {errors.email && (
            <p className="mt-1 flex items-center gap-1 font-mono text-xs text-red-500">
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
            value={formData.phone}
            onChange={(value) => handleChange("phone", value)}
            countryFormat="BR"
            className="bg-white/5"
          />
        </div>

        {/* Location */}
        <div>
          <label className="mb-1.5 flex items-center gap-2 font-mono text-sm text-white">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            location<span className="ml-1 text-xs text-zinc-500">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="São Paulo, BR"
            className="w-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Navigation */}
      <StepNavigation onNext={handleNext} canProceed={canProceed} />
    </div>
  );
}
