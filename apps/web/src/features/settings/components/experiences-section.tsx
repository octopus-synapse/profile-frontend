/**
 * Experiences Section - Refactored
 * Manage work experiences
 */

"use client";

import { Briefcase, Calendar, MapPin, Building } from "lucide-react";
import {
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "../hooks";
import type { Experience, CreateExperiencePayload } from "../types";
import { formatDate } from "@/shared/utils/form-helpers";
import { CrudSection, ItemActions } from "@/shared/components/crud-section";
import { TextInput, DateInput, TextArea, Checkbox } from "@/shared/components/ui/form-input";

const emptyExperience: Partial<CreateExperiencePayload> = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  location: "",
};

export function ExperiencesSection() {
  const { data, isLoading } = useExperiences();
  const experiences = data?.data || [];

  return (
    <CrudSection
      title="Work Experience"
      emptyIcon={Briefcase}
      emptyMessage="No work experiences yet"
      emptyActionLabel="Add your first experience"
      addButtonLabel="Add Experience"
      itemName="experience"
      items={experiences}
      isLoading={isLoading}
      emptyFormData={emptyExperience}
      createMutation={useCreateExperience()}
      updateMutation={useUpdateExperience()}
      deleteMutation={useDeleteExperience()}
      prepareFormData={(exp) => ({
        company: exp.company,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate || "",
        isCurrent: exp.isCurrent,
        description: exp.description || "",
        location: exp.location || "",
      })}
      preparePayload={(formData) => ({
        company: formData.company!,
        position: formData.position!,
        startDate: formData.startDate!,
        endDate: formData.isCurrent ? null : formData.endDate || null,
        isCurrent: formData.isCurrent || false,
        description: formData.description || null,
        location: formData.location || null,
      })}
      validateForm={(formData) => !!(formData.company && formData.position && formData.startDate)}
      renderItem={(exp, onEdit, onDelete) => (
        <div className="group rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-white">{exp.position}</h4>
              <p className="mt-1 flex items-center gap-2 text-sm text-zinc-400">
                <Building className="h-4 w-4" />
                {exp.company}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(exp.startDate)} – {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                </span>
                {exp.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </span>
                )}
              </div>
              {exp.description && (
                <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-zinc-400">
                  {exp.description}
                </p>
              )}
            </div>
            <ItemActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      )}
      renderForm={(formData, setFormData) => (
        <>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput
              label="Company"
              required
              value={formData.company}
              onChange={(e) => setFormData((p: any) => ({ ...p, company: e.target.value }))}
              placeholder="Acme Inc."
            />

            <TextInput
              label="Position"
              required
              value={formData.position}
              onChange={(e) => setFormData((p: any) => ({ ...p, position: e.target.value }))}
              placeholder="Software Engineer"
            />
          </div>

          <TextInput
            label="Location"
            value={formData.location || ""}
            onChange={(e) => setFormData((p: any) => ({ ...p, location: e.target.value }))}
            placeholder="San Francisco, CA"
          />

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
            label="Currently working here"
            checked={formData.isCurrent}
            onChange={(e) => setFormData((p: any) => ({ ...p, isCurrent: e.target.checked }))}
          />

          <TextArea
            label="Description"
            value={formData.description || ""}
            onChange={(e) => setFormData((p: any) => ({ ...p, description: e.target.value }))}
            placeholder="Key responsibilities and achievements..."
            rows={4}
          />
        </>
      )}
    />
  );
}
