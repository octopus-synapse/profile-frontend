'use client';

import { motion } from 'framer-motion';
import { Check, Download, FileText, Sparkles, Star } from 'lucide-react';
import { cn } from '@/shared/utils';
import type { DemoCommand } from './config/demo-commands';

interface DemoPreviewProps {
  command: DemoCommand | null;
}

export function DemoPreview({ command }: DemoPreviewProps) {
  if (!command) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Sparkles className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-zinc-500">Select a command to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={command.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full p-4"
    >
      {command.previewType === 'create' && <CreatePreview />}
      {command.previewType === 'templates' && <TemplatesPreview />}
      {command.previewType === 'export' && <ExportPreview />}
      {command.previewType === 'ats' && <ATSPreview />}
      {command.previewType === 'ai' && <AIPreview />}
    </motion.div>
  );
}

function CreatePreview() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Choose your starting point</h3>
      <div className="grid grid-cols-2 gap-2">
        {['Developer', 'Designer', 'Manager', 'Blank'].map((template) => (
          <div
            key={template}
            className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:border-cyan-500/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <FileText className="h-5 w-5 text-zinc-400" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-zinc-400">{template}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-500">700+ professional templates</p>
    </div>
  );
}

function TemplatesPreview() {
  const templates = [
    { name: 'Modern', color: 'bg-cyan-500/20' },
    { name: 'Classic', color: 'bg-purple-500/20' },
    { name: 'Minimal', color: 'bg-green-500/20' },
    { name: 'Bold', color: 'bg-orange-500/20' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Popular templates</h3>
      <div className="grid grid-cols-2 gap-2">
        {templates.map((t) => (
          <div
            key={t.name}
            className={cn(
              'relative aspect-[3/4] rounded-lg border border-white/10 overflow-hidden',
              'transition-transform hover:scale-105',
            )}
          >
            <div className={cn('absolute inset-0', t.color)} />
            <div className="absolute inset-2 space-y-1">
              <div className="h-2 w-3/4 rounded bg-white/20" />
              <div className="h-1 w-1/2 rounded bg-white/10" />
              <div className="mt-2 h-1 w-full rounded bg-white/10" />
              <div className="h-1 w-full rounded bg-white/10" />
              <div className="h-1 w-2/3 rounded bg-white/10" />
            </div>
            <span className="absolute bottom-1 left-2 text-[10px] text-white/60">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExportPreview() {
  const formats = [
    { name: 'PDF', icon: '📄', popular: true },
    { name: 'DOCX', icon: '📝', popular: false },
    { name: 'Link', icon: '🔗', popular: false },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Export formats</h3>
      <div className="space-y-2">
        {formats.map((format) => (
          <div
            key={format.name}
            className={cn(
              'flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3',
              format.popular && 'border-cyan-500/30 bg-cyan-500/5',
            )}
          >
            <span className="text-lg">{format.icon}</span>
            <span className="flex-1 text-sm text-white">{format.name}</span>
            {format.popular && (
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-400">
                Popular
              </span>
            )}
            <Download className="h-4 w-4 text-zinc-500" strokeWidth={1.5} />
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-500">One-click export, no watermarks</p>
    </div>
  );
}

function ATSPreview() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">ATS Compatibility Score</h3>
      <div className="flex items-center justify-center py-2">
        <div className="relative h-24 w-24">
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 36 36"
            role="img"
            aria-label="ATS compatibility score: 92%"
          >
            <path
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-white/10"
            />
            <path
              d="M18 2.5 a 15.5 15.5 0 0 1 0 31 a 15.5 15.5 0 0 1 0 -31"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="92, 100"
              className="text-cyan-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">92%</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { text: 'Keywords optimized', ok: true },
          { text: 'Format compatible', ok: true },
          { text: 'Add 2 more skills', ok: false },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-xs">
            {item.ok ? (
              <Check className="h-3.5 w-3.5 text-green-500" strokeWidth={2} />
            ) : (
              <Star className="h-3.5 w-3.5 text-yellow-500" strokeWidth={2} />
            )}
            <span className={item.ok ? 'text-zinc-400' : 'text-yellow-500'}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIPreview() {
  const suggestions = [
    'Add quantifiable achievements',
    'Use action verbs in experience',
    'Include relevant keywords',
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">AI Suggestions</h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, i) => (
          <motion.div
            key={suggestion}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/5 p-3"
          >
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" strokeWidth={2} />
            <span className="text-xs text-zinc-300">{suggestion}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-xs text-zinc-500">Powered by GPT-4</p>
    </div>
  );
}
