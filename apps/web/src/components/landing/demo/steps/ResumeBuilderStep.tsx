'use client';

/**
 * Resume Builder Step - Fast auto-build animation
 *
 * Shows resume sections being filled automatically.
 * Total time: ~12 seconds
 */

import { motion } from 'framer-motion';
import { Check, FileText, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const SECTIONS = [
  { id: 'header', label: 'Personal Info', time: 800 },
  { id: 'summary', label: 'Summary', time: 1200 },
  { id: 'experience', label: 'Experience', time: 1500 },
  { id: 'skills', label: 'Skills', time: 800 },
  { id: 'education', label: 'Education', time: 700 },
];

export function ResumeBuilderStep() {
  const { state, nextStep } = useDemo();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const userName = state.userName || 'Alex Chen';

  useEffect(() => {
    let totalTime = 0;

    for (const section of SECTIONS) {
      const startTime = totalTime;
      const endTime = totalTime + section.time;

      // Start section
      setTimeout(() => setActiveSection(section.id), startTime);

      // Complete section
      setTimeout(() => {
        setCompletedSections((prev) => [...prev, section.id]);
        setActiveSection(null);
      }, endTime);

      totalTime = endTime + 200; // Small gap between sections
    }

    // Auto-advance after all sections complete
    const advanceTimer = setTimeout(nextStep, totalTime + 800);
    return () => clearTimeout(advanceTimer);
  }, [nextStep]);

  const allComplete = completedSections.length === SECTIONS.length;

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <FileText className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Resume Builder
          </h3>
          <p className="text-sm text-zinc-300">AI-powered content generation</p>
        </div>
      </motion.div>

      <div className="flex flex-1 gap-6">
        {/* Left: Progress list */}
        <div className="w-48 shrink-0">
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Building
          </p>
          <div className="space-y-2">
            {SECTIONS.map((section) => {
              const isComplete = completedSections.includes(section.id);
              const isActive = activeSection === section.id;

              return (
                <div
                  key={section.id}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors',
                    isActive && 'bg-zinc-800/50',
                    isComplete && 'bg-zinc-800/30',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded transition-colors',
                      isComplete ? 'bg-zinc-600' : 'bg-zinc-800',
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-3 w-3 text-zinc-200" />
                    ) : isActive ? (
                      <motion.div
                        className="h-2 w-2 rounded-full bg-zinc-400"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                      />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-sm transition-colors',
                      isComplete || isActive ? 'text-zinc-300' : 'text-zinc-500',
                    )}
                  >
                    {section.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Resume preview */}
        <div className="flex-1 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
          <div className="h-full overflow-auto p-5">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: completedSections.includes('header') ? 1 : 0.3 }}
              className="mb-4 border-b border-zinc-800 pb-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <User className="h-5 w-5 text-zinc-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">{userName}</h3>
                  <p className="text-sm text-zinc-400">Senior Frontend Developer</p>
                </div>
              </div>
            </motion.div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: completedSections.includes('summary') ? 1 : 0.3 }}
              className="mb-4"
            >
              <p className="text-sm leading-relaxed text-zinc-300">
                Passionate developer with 5+ years building scalable web apps. Expert in React,
                TypeScript, and modern frontend architecture.
              </p>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: completedSections.includes('experience') ? 1 : 0.3 }}
              className="mb-4"
            >
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Experience
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-zinc-200">Senior Frontend Dev</span>
                    <span className="text-xs text-zinc-500">2021 - Present</span>
                  </div>
                  <p className="text-sm text-zinc-400">TechCorp</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-zinc-200">Frontend Developer</span>
                    <span className="text-xs text-zinc-500">2019 - 2021</span>
                  </div>
                  <p className="text-sm text-zinc-400">StartupXYZ</p>
                </div>
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: completedSections.includes('skills') ? 1 : 0.3 }}
              className="mb-4"
            >
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'].map((skill) => (
                  <span key={skill} className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0.3 }}
              animate={{ opacity: completedSections.includes('education') ? 1 : 0.3 }}
            >
              <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Education
              </h4>
              <div>
                <span className="text-sm font-medium text-zinc-200">B.S. Computer Science</span>
                <p className="text-sm text-zinc-400">University of São Paulo, 2019</p>
              </div>
            </motion.div>
          </div>

          {/* Completion indicator */}
          {allComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-zinc-800 bg-zinc-900/80 px-4 py-2"
            >
              <p className="text-center text-xs text-zinc-400">Resume ready</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
