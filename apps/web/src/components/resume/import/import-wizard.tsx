'use client';

/**
 * Import Wizard
 *
 * Multi-step dialog for importing a resume from JSON Resume data.
 * Steps: Upload → Preview → Processing → Done
 */

import { useState } from 'react';
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Upload } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import { cn } from '@/shared/utils';
import { useImportJson, useImportStatus } from '../hooks/use-resume-import';
import { UploadStep } from './upload-step';
import type { ParsedData } from './upload-step';

// ============================================================================
// Types
// ============================================================================

interface ImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (resumeId: string) => void;
}

type Step = 'upload' | 'preview' | 'processing' | 'done';

// ============================================================================
// Step Indicator
// ============================================================================

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'preview', label: 'Preview' },
  { key: 'processing', label: 'Import' },
  { key: 'done', label: 'Done' },
];

function StepIndicator({ current }: { current: Step }) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="flex items-center gap-2 px-6 pb-4">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
              i < currentIdx && 'bg-emerald-500/20 text-emerald-400',
              i === currentIdx && 'bg-cyan-500/20 text-cyan-400',
              i > currentIdx && 'bg-white/5 text-zinc-500',
            )}
          >
            {i < currentIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
          </div>
          <span
            className={cn(
              'hidden text-xs sm:inline',
              i === currentIdx ? 'text-white' : 'text-zinc-500',
            )}
          >
            {step.label}
          </span>
          {i < STEPS.length - 1 && <div className="h-px w-4 bg-white/10" />}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Preview Step
// ============================================================================

function PreviewStep({
  data,
  onBack,
  onConfirm,
  isPending,
}: {
  data: ParsedData;
  onBack: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  const rows = [
    { label: 'Name', value: data.basics?.name },
    { label: 'Email', value: data.basics?.email },
    { label: 'Summary', value: data.basics?.summary ? 'Yes' : 'None' },
    { label: 'Work entries', value: data.work?.length ?? 0 },
    { label: 'Education entries', value: data.education?.length ?? 0 },
    { label: 'Skills', value: data.skills?.length ?? 0 },
  ];

  return (
    <div className="space-y-4 p-6 pt-0">
      <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
        <dl className="space-y-3">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <dt className="text-zinc-400">{r.label}</dt>
              <dd className="font-medium text-white">{String(r.value ?? '—')}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={onConfirm} disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isPending ? 'Importing…' : 'Import'}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Processing / Done Steps
// ============================================================================

function StatusStep({
  importId,
  onSuccess,
  onClose,
}: {
  importId: string;
  onSuccess?: (resumeId: string) => void;
  onClose: () => void;
}) {
  const { data: job } = useImportStatus(importId);

  if (job?.status === 'COMPLETED' && job.resumeId) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
        <div className="rounded-full bg-emerald-500/20 p-4">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <p className="text-base font-medium text-white">Import Complete</p>
          <p className="mt-1 text-sm text-zinc-400">Your resume has been imported successfully.</p>
        </div>
        <Button onClick={() => { onSuccess?.(job.resumeId!); onClose(); }} className="gap-2">
          View Resume
        </Button>
      </div>
    );
  }

  if (job?.status === 'FAILED') {
    return (
      <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
        <div className="rounded-full bg-red-500/20 p-4">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <p className="text-base font-medium text-white">Import Failed</p>
          {job.errors?.map((err) => (
            <p key={err} className="mt-1 text-sm text-red-400">{err}</p>
          ))}
        </div>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 pt-0 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
      <div>
        <p className="text-base font-medium text-white">
          {job?.status === 'PROCESSING' ? 'Processing…' : 'Waiting to start…'}
        </p>
        <p className="mt-1 text-sm text-zinc-400">This usually takes a few seconds.</p>
      </div>
    </div>
  );
}

// ============================================================================
// Wizard Orchestrator
// ============================================================================

export function ImportWizard({ open, onOpenChange, onSuccess }: ImportWizardProps) {
  const [step, setStep] = useState<Step>('upload');
  const [rawJson, setRawJson] = useState('');
  const [preview, setPreview] = useState<ParsedData | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  const importJson = useImportJson();

  const reset = () => {
    setStep('upload');
    setRawJson('');
    setPreview(null);
    setImportId(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleConfirmImport = async () => {
    try {
      const result = await importJson.mutateAsync({ content: rawJson });
      const id = (result as unknown as { importId: string }).importId;
      setImportId(id);
      setStep('processing');
    } catch {
      showToast.error('Failed to start import');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Resume</DialogTitle>
          <DialogDescription>Import your resume from JSON Resume format.</DialogDescription>
        </DialogHeader>

        <StepIndicator current={step} />

        {step === 'upload' && (
          <UploadStep
            onParsed={(raw, data) => {
              setRawJson(raw);
              setPreview(data);
              setStep('preview');
            }}
          />
        )}

        {step === 'preview' && preview && (
          <PreviewStep
            data={preview}
            onBack={() => setStep('upload')}
            onConfirm={() => void handleConfirmImport()}
            isPending={importJson.isPending}
          />
        )}

        {(step === 'processing' || step === 'done') && importId && (
          <StatusStep
            importId={importId}
            onSuccess={onSuccess}
            onClose={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
