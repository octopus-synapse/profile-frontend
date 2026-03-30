'use client';

/**
 * Import Wizard — multi-step dialog for importing a resume from JSON Resume.
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  showToast,
} from '@octopus-synapse/profile-ui';
import { useResumeImportImportJson } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import { PreviewStep } from './preview-step';
import { StatusStep } from './status-step';
import { type ImportStep, StepIndicator } from './step-indicator';
import type { ParsedData } from './upload-step';
import { UploadStep } from './upload-step';

interface ImportWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (resumeId: string) => void;
}

export function ImportWizard({ open, onOpenChange, onSuccess }: ImportWizardProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<ImportStep>('upload');
  const [rawJson, setRawJson] = useState('');
  const [preview, setPreview] = useState<ParsedData | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  const importMutation = useResumeImportImportJson();

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
      const parsedData = JSON.parse(rawJson) as Record<string, unknown>;
      const result = await importMutation.mutateAsync({
        data: { data: parsedData as unknown as { basics: { name: string } } },
      });
      const responseData = result?.data?.data as { importId?: string } | undefined;
      const id = responseData?.importId;
      if (id) {
        setImportId(id);
        setStep('processing');
      }
    } catch {
      showToast.error('Failed to start import');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('resume.import.wizard.title')}</DialogTitle>
          <DialogDescription>{t('resume.import.wizard.description')}</DialogDescription>
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
            isPending={importMutation.isPending}
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
