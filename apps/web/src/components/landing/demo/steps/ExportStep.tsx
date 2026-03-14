'use client';

/**
 * Export Step - Fast export animation
 *
 * Shows format selection and download progress.
 * Total time: ~8 seconds
 */

import { motion } from 'framer-motion';
import { Check, Download, FileText } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDemo } from '../context';

const FORMATS = [
  { id: 'pdf', name: 'PDF', desc: 'Best for ATS' },
  { id: 'docx', name: 'Word', desc: 'Editable' },
  { id: 'link', name: 'Link', desc: 'Shareable' },
];

export function ExportStep() {
  const { state, setExportFormat, nextStep } = useDemo();
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  const userName = state.userName || 'Alex';

  // Auto-select PDF and export
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Select PDF
    timers.push(
      setTimeout(() => {
        setSelectedFormat('pdf');
        setExportFormat('pdf');
      }, 1000),
    );

    // Progress animation
    timers.push(
      setTimeout(() => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              setComplete(true);
              return 100;
            }
            return prev + 5;
          });
        }, 40);
      }, 1500),
    );

    // Auto-advance
    timers.push(setTimeout(nextStep, 6500));

    return () => timers.forEach(clearTimeout);
  }, [setExportFormat, nextStep]);

  return (
    <div className="flex h-full flex-col p-6">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800">
          <Download className="h-4 w-4 text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Export Resume
          </h3>
          <p className="text-sm text-zinc-300">Multiple format options</p>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800">
            {complete ? (
              <Check className="h-5 w-5 text-zinc-300" />
            ) : (
              <Download className="h-5 w-5 text-zinc-300" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-100">
              {complete ? 'Export Complete' : 'Generating File'}
            </h3>
            <p className="text-xs text-zinc-500">
              {complete ? `${userName}_resume.pdf` : 'PDF format selected'}
            </p>
          </div>
        </motion.div>

        {/* Format selection */}
        {!selectedFormat && (
          <div className="flex gap-3">
            {FORMATS.map((format, index) => (
              <motion.div
                key={format.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex w-24 flex-col items-center rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <FileText className="mb-2 h-5 w-5 text-zinc-400" />
                <span className="text-sm font-medium text-zinc-200">{format.name}</span>
                <span className="text-xs text-zinc-500">{format.desc}</span>
              </motion.div>
            ))}
          </div>
        )}

        {/* Progress */}
        {selectedFormat && !complete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-64">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-zinc-500">Generating PDF</span>
              <span className="tabular-nums text-zinc-400">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <motion.div
                className="h-full bg-zinc-500"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}

        {/* Complete */}
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-6 py-4"
          >
            <p className="text-sm text-zinc-300">Ready to download</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
