/**
 * Experience Step
 *
 * Nielsen: User control and freedom (add/remove items, skip step)
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Experience } from "../../stores";
import { StepNavigation } from "../step-navigation";
import { Plus, Trash2, Calendar, MapPin, Building } from "lucide-react";
import { nanoid } from "nanoid";

export function ExperienceStep() {
  const {
    experiences,
    noExperience,
    setNoExperience,
    addExperience,
    removeExperience,
    goToNextStep,
    markStepComplete,
  } = useOnboardingStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    location: "",
  });

  const handleAddExperience = () => {
    if (!newExp.company || !newExp.position || !newExp.startDate) return;

    addExperience({
      id: nanoid(),
      company: newExp.company,
      position: newExp.position,
      startDate: newExp.startDate,
      endDate: newExp.isCurrent ? undefined : newExp.endDate,
      isCurrent: newExp.isCurrent || false,
      description: newExp.description,
      location: newExp.location,
    });

    setNewExp({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      location: "",
    });
    setIsAdding(false);
  };

  const handleToggleNoExperience = () => {
    setNoExperience(!noExperience);
  };

  const handleNext = () => {
    markStepComplete("experience");
    goToNextStep();
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
          <h2 className="text-pf-fg-default text-xl font-bold">Work Experience</h2>
          <span className="bg-pf-canvas-inset text-pf-fg-subtle ml-2 px-2 py-0.5 font-mono text-xs">
            optional
          </span>
        </div>
        <p className="text-pf-fg-muted mt-1 font-mono text-xs">
          Add your work history or skip if you&apos;re just starting out
        </p>
      </div>

      {/* No Experience Toggle */}
      <label className="border-pf-border-default bg-pf-canvas-subtle flex cursor-pointer items-center gap-3 border p-3">
        <input
          type="checkbox"
          checked={noExperience}
          onChange={handleToggleNoExperience}
          className="text-pf-accent-fg h-4 w-4"
        />
        <span className="text-pf-fg-muted font-mono text-sm">
          I&apos;m just starting my career (no prior experience)
        </span>
      </label>

      {!noExperience && (
        <>
          {/* Experience List */}
          {experiences.length > 0 && (
            <div className="space-y-3">
              <div className="text-pf-fg-subtle font-mono text-xs">
                <span className="opacity-60">{"//"}</span> {experiences.length} experience
                {experiences.length > 1 ? "s" : ""} added
              </div>

              {experiences.map((exp: Experience) => (
                <div key={exp.id} className="border-pf-border-default border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-pf-fg-default font-mono text-sm font-semibold">
                        {exp.position}
                      </h4>
                      <p className="text-pf-fg-muted mt-0.5 flex items-center gap-2 font-mono text-xs">
                        <Building className="h-3 w-3" />
                        {exp.company}
                        {exp.location && (
                          <>
                            <span className="text-pf-border-default">•</span>
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </>
                        )}
                      </p>
                      <p className="text-pf-fg-subtle mt-1 flex items-center gap-1 font-mono text-xs">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="text-pf-danger-fg hover:bg-pf-danger-subtle p-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {exp.description && (
                    <p className="text-pf-fg-muted mt-2 border-t border-dashed pt-2 font-mono text-xs">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Experience Form */}
          {isAdding ? (
            <div className="border-pf-accent-fg/30 bg-pf-canvas-subtle space-y-4 border p-4">
              <div className="text-pf-accent-fg font-mono text-xs">
                <span className="opacity-60">{"//"}</span> New experience
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                    company<span className="text-pf-danger-fg">*</span>
                  </label>
                  <input
                    type="text"
                    value={newExp.company}
                    onChange={(e) =>
                      setNewExp((prev: Partial<Experience>) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    placeholder="Google"
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                    position<span className="text-pf-danger-fg">*</span>
                  </label>
                  <input
                    type="text"
                    value={newExp.position}
                    onChange={(e) =>
                      setNewExp((prev: Partial<Experience>) => ({
                        ...prev,
                        position: e.target.value,
                      }))
                    }
                    placeholder="Senior Engineer"
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-pf-fg-default mb-1 block font-mono text-xs">location</label>
                <input
                  type="text"
                  value={newExp.location}
                  onChange={(e) =>
                    setNewExp((prev: Partial<Experience>) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Mountain View, CA"
                  className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                    startDate<span className="text-pf-danger-fg">*</span>
                  </label>
                  <input
                    type="date"
                    value={newExp.startDate}
                    onChange={(e) =>
                      setNewExp((prev: Partial<Experience>) => ({
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
                    value={newExp.endDate}
                    onChange={(e) =>
                      setNewExp((prev: Partial<Experience>) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    disabled={newExp.isCurrent}
                    className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default focus:border-pf-accent-fg w-full border px-3 py-2 font-mono text-sm focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newExp.isCurrent}
                  onChange={(e) =>
                    setNewExp((prev: Partial<Experience>) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                    }))
                  }
                  className="text-pf-accent-fg h-4 w-4"
                />
                <span className="text-pf-fg-muted font-mono text-xs">I currently work here</span>
              </label>

              <div>
                <label className="text-pf-fg-default mb-1 block font-mono text-xs">
                  description
                </label>
                <textarea
                  value={newExp.description}
                  onChange={(e) =>
                    setNewExp((prev: Partial<Experience>) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                  className="border-pf-border-default bg-pf-canvas-overlay text-pf-fg-default placeholder:text-pf-fg-subtle focus:border-pf-accent-fg w-full resize-none border px-3 py-2 font-mono text-sm focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="text-pf-fg-muted hover:text-pf-fg-default px-3 py-1.5 font-mono text-sm transition-colors"
                >
                  cancel
                </button>
                <button
                  onClick={handleAddExperience}
                  disabled={!newExp.company || !newExp.position || !newExp.startDate}
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
              Add experience
            </button>
          )}
        </>
      )}

      {/* Navigation */}
      <StepNavigation onNext={handleNext} showSkip={true} canProceed={true} />
    </div>
  );
}
