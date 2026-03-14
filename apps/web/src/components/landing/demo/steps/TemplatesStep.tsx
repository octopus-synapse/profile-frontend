'use client';

/**
 * Templates Step - Auto-selects a template
 *
 * Shows template options with auto-selection animation.
 * Total time: ~8 seconds
 */

import { motion } from 'framer-motion';
import { Check, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/shared/utils';
import { useDemo } from '../context';

const TEMPLATES = [
  { id: 'executive', name: 'Executive', popular: true },
  { id: 'modern', name: 'Modern', popular: true },
  { id: 'minimal', name: 'Minimal', popular: false },
  { id: 'nordic', name: 'Nordic', popular: false },
];

export function TemplatesStep() {
  const { setSelectedTemplate, setSelectedColor, nextStep } = useDemo();
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Auto-hover animation then select
  useEffect(() => {
    const hoverSequence = [0, 1, 0, 1];
    let step = 0;

    const hoverInterval = setInterval(() => {
      if (step < hoverSequence.length) {
        setHoveredIndex(hoverSequence[step] ?? 0);
        step++;
      } else {
        clearInterval(hoverInterval);
        // Select "Modern" template (index 1)
        setSelectedIndex(1);
        setSelectedTemplate('modern');
        setSelectedColor('zinc');

        // Auto-advance
        setTimeout(nextStep, 1500);
      }
    }, 600);

    return () => clearInterval(hoverInterval);
  }, [setSelectedTemplate, setSelectedColor, nextStep]);

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <Layers className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Template Selection
          </h3>
          <p className="text-sm text-zinc-300">700+ professional designs</p>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-4">
          {TEMPLATES.map((template, index) => {
            const isHovered = hoveredIndex === index;
            const isSelected = selectedIndex === index;

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'relative w-32 cursor-pointer rounded-lg border transition-all',
                  isSelected && 'border-zinc-500 ring-1 ring-zinc-500',
                  isHovered && !isSelected && 'border-zinc-600',
                  !isHovered && !isSelected && 'border-zinc-800',
                )}
              >
                {/* Template preview */}
                <div className="aspect-[8.5/11] rounded-t-lg bg-zinc-900 p-3">
                  <div className="h-full rounded bg-zinc-950 p-2">
                    <div className="mb-2 h-1.5 w-10 rounded bg-zinc-700" />
                    <div className="mb-1 h-1 w-8 rounded bg-zinc-800" />
                    <div className="mb-2 h-px w-full bg-zinc-800" />
                    <div className="space-y-1">
                      <div className="h-1 w-full rounded bg-zinc-800" />
                      <div className="h-1 w-5/6 rounded bg-zinc-800" />
                      <div className="h-1 w-4/6 rounded bg-zinc-800" />
                    </div>
                  </div>
                </div>

                {/* Label */}
                <div className="flex items-center justify-between border-t border-zinc-800 px-2 py-1.5">
                  <span className="text-xs text-zinc-400">{template.name}</span>
                  {template.popular && <span className="text-[10px] text-zinc-600">Popular</span>}
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -right-1 -top-1"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100">
                      <Check className="h-3 w-3 text-zinc-900" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {selectedIndex >= 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-xs text-zinc-500"
          >
            Template selected
          </motion.p>
        )}
      </div>
    </div>
  );
}
