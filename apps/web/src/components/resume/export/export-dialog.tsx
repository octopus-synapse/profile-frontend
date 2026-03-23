'use client';

/**
 * Export Dialog
 *
 * Modal for exporting a resume in multiple formats (PDF, DOCX, JSON, LaTeX, PNG banner).
 * Each format card triggers its own mutation hook; file download is handled by the hook layer.
 */

import { useState } from 'react';
import { useI18n } from '@profile/i18n';
import { Code, Download, FileCode, FileText, Image, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { showToast } from '@/shared/components/ui/toast';
import {
  useExportBanner,
  useExportDOCX,
  useExportJSON,
  useExportLaTeX,
  useExportPDF,
} from '../hooks/use-resume-export';

// ============================================================================
// Types
// ============================================================================

interface ExportDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type JsonFormat = 'jsonresume' | 'profile';
type LaTeXTemplate = 'simple' | 'moderncv';

interface FormatCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isPending: boolean;
  onExport: () => void;
  children?: React.ReactNode;
}

// ============================================================================
// Format Card
// ============================================================================

function FormatCard({ icon: Icon, title, description, isPending, onExport, children }: FormatCardProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5">
          <Icon className="h-4 w-4 text-zinc-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
        </div>
      </div>

      {children && <div className="pl-12">{children}</div>}

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onExport}
          disabled={isPending}
          className="h-8 gap-1.5 px-3 text-xs"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          {isPending ? t('resume.export.exporting') : t('resume.export.download')}
        </Button>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-option Select
// ============================================================================

interface OptionSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

function OptionSelect<T extends string>({ label, value, onChange, options }: OptionSelectProps<T>) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ExportDialog({ resumeId, open, onOpenChange }: ExportDialogProps) {
  const { t } = useI18n();
  const [jsonFormat, setJsonFormat] = useState<JsonFormat>('jsonresume');
  const [latexTemplate, setLatexTemplate] = useState<LaTeXTemplate>('simple');

  const jsonFormatOptions = [
    { value: 'jsonresume' as const, label: t('resume.export.jsonFormat.jsonresume') },
    { value: 'profile' as const, label: t('resume.export.jsonFormat.profile') },
  ];

  const latexTemplateOptions = [
    { value: 'simple' as const, label: t('resume.export.latexTemplate.simple') },
    { value: 'moderncv' as const, label: t('resume.export.latexTemplate.moderncv') },
  ];

  const exportPDF = useExportPDF(resumeId);
  const exportDOCX = useExportDOCX(resumeId);
  const exportJSON = useExportJSON(resumeId);
  const exportLaTeX = useExportLaTeX(resumeId);
  const exportBanner = useExportBanner();

  const handleExport = async (label: string, exportFn: () => Promise<unknown>) => {
    try {
      await exportFn();
    } catch {
      showToast.error(t('resume.export.failedExport', { label }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('resume.export.title')}</DialogTitle>
          <DialogDescription>
            {t('resume.export.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <FormatCard
            icon={FileText}
            title={t('resume.export.format.pdf')}
            description={t('resume.export.format.pdfDesc')}
            isPending={exportPDF.isPending}
            onExport={() => void handleExport('PDF', () => exportPDF.mutateAsync({}))}
          />

          <FormatCard
            icon={FileText}
            title={t('resume.export.format.docx')}
            description={t('resume.export.format.docxDesc')}
            isPending={exportDOCX.isPending}
            onExport={() => void handleExport('DOCX', () => exportDOCX.mutateAsync())}
          />

          <FormatCard
            icon={Code}
            title={t('resume.export.format.json')}
            description={t('resume.export.format.jsonDesc')}
            isPending={exportJSON.isPending}
            onExport={() =>
              void handleExport('JSON', () => exportJSON.mutateAsync({ format: jsonFormat }))
            }
          >
            <OptionSelect
              label={t('resume.export.option.format')}
              value={jsonFormat}
              onChange={setJsonFormat}
              options={jsonFormatOptions}
            />
          </FormatCard>

          <FormatCard
            icon={FileCode}
            title={t('resume.export.format.latex')}
            description={t('resume.export.format.latexDesc')}
            isPending={exportLaTeX.isPending}
            onExport={() =>
              void handleExport('LaTeX', () => exportLaTeX.mutateAsync({ template: latexTemplate }))
            }
          >
            <OptionSelect
              label={t('resume.export.option.template')}
              value={latexTemplate}
              onChange={setLatexTemplate}
              options={latexTemplateOptions}
            />
          </FormatCard>

          <FormatCard
            icon={Image}
            title={t('resume.export.format.banner')}
            description={t('resume.export.format.bannerDesc')}
            isPending={exportBanner.isPending}
            onExport={() => void handleExport('Banner', () => exportBanner.mutateAsync({}))}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
