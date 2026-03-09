/**
 * Experience Step
 *
 * Nielsen: User control and freedom (add/remove items, skip step)
 */

"use client";

import { useState } from "react";
import { useOnboardingStore, type Experience } from "../stores";
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

    // Validate dates: endDate must be after startDate
    if (!newExp.isCurrent && newExp.endDate && newExp.startDate) {
      const startDate = new Date(newExp.startDate);
      const endDate = new Date(newExp.endDate);
      if (endDate < startDate) {
        alert("End date must be after start date");
        return;
      }
    }

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
          <span className="font-mono text-sm text-cyan-400">{`>`}</span>
          <h2 className="text-xl font-bold text-white">Work Experience</h2>
          <span className="ml-2 bg-white/5 px-2 py-0.5 font-mono text-xs text-zinc-500">
            optional
          </span>
        </div>
        <p className="mt-1 font-mono text-xs text-zinc-400">
          Add your work history or skip if you&apos;re just starting out
        </p>
      </div>

      {/* No Experience Toggle */}
      <label className="flex cursor-pointer items-center gap-3 border border-white/10 bg-white/5 p-3">
        <input
          type="checkbox"
          checked={noExperience}
          onChange={handleToggleNoExperience}
          className="h-4 w-4 text-cyan-400"
        />
        <span className="font-mono text-sm text-zinc-400">
          I&apos;m just starting my career (no prior experience)
        </span>
      </label>

      {!noExperience && (
        <>
          {/* Experience List */}
          {experiences.length > 0 && (
            <div className="space-y-3">
              <div className="font-mono text-xs text-zinc-500">
                <span className="opacity-60">{"//*"}</span> {experiences.length} experience
                {experiences.length > 1 ? "s" : ""} added
              </div>

              {experiences.map((exp: Experience) => (
                <div key={exp.id} className="border border-white/10 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-mono text-sm font-semibold text-white">{exp.position}</h4>
                      <p className="mt-0.5 flex items-center gap-2 font-mono text-xs text-zinc-400">
                        <Building className="h-3 w-3" />
                        {exp.company}
                        {exp.location && (
                          <>
                            <span className="text-white/10">•</span>
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </>
                        )}
                      </p>
                      <p className="mt-1 flex items-center gap-1 font-mono text-xs text-zinc-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate || "")}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExperience(exp.id)}
                      className="p-1 text-red-500 transition-colors hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                  {exp.description && (
                    <p className="mt-2 border-t border-dashed pt-2 font-mono text-xs text-zinc-400">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Experience Form */}
          {isAdding ? (
            <div className="space-y-4 border border-cyan-500/30 bg-white/5 p-4">
              <div className="font-mono text-xs text-cyan-400">
                <span className="opacity-60">{"//"}</span> New experience
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-xs text-white">
                    company<span className="text-red-500">*</span>
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
                    className="w-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-xs text-white">
                    position<span className="text-red-500">*</span>
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
                    className="w-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-mono text-xs text-white">location</label>
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
                  className="w-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block font-mono text-xs text-white">
                    startDate<span className="text-red-500">*</span>
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
                    className="w-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block font-mono text-xs text-white">endDate</label>
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
                    className="w-full border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white focus:border-cyan-500 focus:outline-none disabled:opacity-50"
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
                  className="h-4 w-4 text-cyan-400"
                />
                <span className="font-mono text-xs text-zinc-400">I currently work here</span>
              </label>

              <div>
                <label className="mb-1 block font-mono text-xs text-white">description</label>
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
                  className="w-full resize-none border border-white/10 bg-[#0A0A0A]/80 px-3 py-2 font-mono text-sm text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 font-mono text-sm text-zinc-400 transition-colors hover:text-white"
                >
                  cancel
                </button>
                <button
                  onClick={handleAddExperience}
                  disabled={!newExp.company || !newExp.position || !newExp.startDate}
                  className="bg-white px-3 py-1.5 font-mono text-sm text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="flex w-full items-center justify-center gap-2 border border-dashed border-white/10 py-3 font-mono text-sm text-zinc-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
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
