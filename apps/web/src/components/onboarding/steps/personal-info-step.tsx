/**
 * Personal Info Step
 *
 * Nielsen: Error prevention (validation), Help users recognize errors
 */

"use client";

import { useState, useMemo } from "react";
import { useOnboardingStore } from "../stores";
import { StepNavigation } from "../step-navigation";
import { User, Mail, Phone, MapPin, AlertCircle } from "lucide-react";
import { PhoneInput } from "@/shared/components/ui";

/**
 * Validation constants for UX feedback.
 * Server-side validation is authoritative.
 */
const FULL_NAME_MIN = 2;
const FULL_NAME_MAX = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,20}$/;
const LOCATION_MAX = 100;

interface ValidationResult {
 valid: boolean;
 message: string;
}

function validateFullName(value: string): ValidationResult {
 if (!value) return { valid: false, message: "Name is required" };
 if (value.length < FULL_NAME_MIN)
  return {
   valid: false,
   message: `Must be at least ${FULL_NAME_MIN} characters`,
  };
 if (value.length > FULL_NAME_MAX)
  return {
   valid: false,
   message: `Must be at most ${FULL_NAME_MAX} characters`,
  };
 return { valid: true, message: "" };
}

function validateEmail(value: string): ValidationResult {
 if (!value) return { valid: false, message: "Email is required" };
 if (!EMAIL_REGEX.test(value))
  return { valid: false, message: "Invalid email format" };
 return { valid: true, message: "" };
}

function validatePhone(value: string): ValidationResult {
 if (!value) return { valid: true, message: "" }; // Optional
 if (!PHONE_REGEX.test(value))
  return { valid: false, message: "Invalid phone format" };
 return { valid: true, message: "" };
}

function validateLocation(value: string): ValidationResult {
 if (!value) return { valid: true, message: "" }; // Optional
 if (value.length > LOCATION_MAX)
  return {
   valid: false,
   message: `Must be at most ${LOCATION_MAX} characters`,
  };
 return { valid: true, message: "" };
}

export function PersonalInfoStep() {
 const { personalInfo, setPersonalInfo, goToNextStep, markStepComplete } =
  useOnboardingStore();

 const [formData, setFormData] = useState({
  fullName: personalInfo?.fullName || "",
  email: personalInfo?.email || "",
  phone: personalInfo?.phone || "",
  location: personalInfo?.location || "",
 });

 const [touched, setTouched] = useState<Record<string, boolean>>({});

 // Client-side validation for UX feedback
 const errors = useMemo(() => {
  const newErrors: Record<string, string> = {};

  if (touched.fullName) {
   const result = validateFullName(formData.fullName);
   if (!result.valid) newErrors.fullName = result.message;
  }

  if (touched.email) {
   const result = validateEmail(formData.email);
   if (!result.valid) newErrors.email = result.message;
  }

  if (touched.phone && formData.phone) {
   const result = validatePhone(formData.phone);
   if (!result.valid) newErrors.phone = result.message;
  }

  if (touched.location && formData.location) {
   const result = validateLocation(formData.location);
   if (!result.valid) newErrors.location = result.message;
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

  // Validate all fields
  const nameResult = validateFullName(formData.fullName);
  const emailResult = validateEmail(formData.email);
  const phoneResult = validatePhone(formData.phone);
  const locationResult = validateLocation(formData.location);

  if (
   !nameResult.valid ||
   !emailResult.valid ||
   !phoneResult.valid ||
   !locationResult.valid
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
  const nameResult = validateFullName(formData.fullName);
  const emailResult = validateEmail(formData.email);
  return nameResult.valid && emailResult.valid;
 }, [formData.fullName, formData.email]);

 return (
  <div className="space-y-6">
   {/* Header */}
   <div>
    <div className="flex items-center gap-2">
     <span className="font-mono text-sm text-cyan-400">{`>`}</span>
     <h2 className="text-xl font-bold text-white">Personal Information</h2>
    </div>
    <p className="mt-1 font-mono text-xs text-zinc-400">
     Basic info for your profile header
    </p>
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
