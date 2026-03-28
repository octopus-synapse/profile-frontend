/**
 * FormErrorAlert — animated error message display.
 */

'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string | null;
}

export function FormErrorAlert({ message }: Props) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="overflow-hidden"
    >
      <div className="flex items-center gap-3 rounded-lg border border-red-500/20 bg-red-500/10 p-3 font-mono text-xs text-red-400">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>{message}</span>
      </div>
    </motion.div>
  );
}
