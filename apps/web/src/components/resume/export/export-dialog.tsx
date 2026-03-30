'use client';

/**
 * Export Dialog
 *
 * Modal for exporting a resume in multiple formats (PDF, DOCX, JSON, LaTeX, PNG banner).
 */

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  showToast,
} from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import type { LucideIcon } from 'lucide-react';
import { Code, Download, FileCode, FileText, Image, Loader2 } from 'lucide-react';
import { useState } from 'react';
import {
  handleExportBanner,
  handleExportDOCX,
  handleExportJSON,
  handleExportLaTeX,
  handleExportPDF,
  type JsonFormat,
  type LaTeXTemplate,
} from './export-handlers';

interface ExportDialogProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormatCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isPending: boolean;
  onExport: () => void;
  children?: React.ReactNode;
}

function FormatCard({
  icon: Icon,
  title,
  description,
  isPending,
  onExport,
  children,
}: FormatCardProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-pf-border-default bg-pf-neutral-subtle p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-pf-hover-subtle">
          <Icon className="h-4 w-4 text-pf-fg-muted" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-pf-fg-default">{title}</p>
          <p className="mt-0.5 text-xs text-pf-fg-subtle">{description}</p>
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

interface OptionSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}

function OptionSelect<T extends string>({ label, value, onChange, options }: OptionSelectProps<T>) {
  return (
    <label className="flex items-center gap-2 text-xs text-pf-fg-muted">
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="rounded-md border border-pf-border-default bg-pf-hover-subtle px-2 py-1 text-xs text-pf-fg-default outline-none focus:border-pf-accent-emphasis"
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

export function ExportDialog({ resumeId, open, onOpenChange }: ExportDialogProps) {
  const { t } = useI18n();
  const [jsonFormat, setJsonFormat] = useState<JsonFormat>('jsonresume');
  const [latexTemplate, setLatexTemplate] = useState<LaTeXTemplate>('simple');
  const [pending, setPending] = useState<Record<string, boolean>>({});

  const jsonFormatOptions = [
    { value: 'jsonresume' as const, label: t('resume.export.jsonFormat.jsonresume') },
    { value: 'profile' as const, label: t('resume.export.jsonFormat.profile') },
  ];

  const latexTemplateOptions = [
    { value: 'simple' as const, label: t('resume.export.latexTemplate.simple') },
    { value: 'moderncv' as const, label: t('resume.export.latexTemplate.moderncv') },
  ];

  const createHandler =
    (key: string, handler: () => Promise<boolean>, label: string) => async () => {
      setPending((p) => ({ ...p, [key]: true }));
      try {
        await handler();
      } catch {
        showToast.error(t('resume.export.failedExport', { label }));
      } finally {
        setPending((p) => ({ ...p, [key]: false }));
      }
    };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('resume.export.title')}</DialogTitle>
          <DialogDescription>{t('resume.export.description')}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <FormatCard
            icon={FileText}
            title={t('resume.export.format.pdf')}
            description={t('resume.export.format.pdfDesc')}
            isPending={pending.pdf ?? false}
            onExport={() => void createHandler('pdf', () => handleExportPDF(resumeId), 'PDF')()}
          />
          <FormatCard
            icon={FileText}
            title={t('resume.export.format.docx')}
            description={t('resume.export.format.docxDesc')}
            isPending={pending.docx ?? false}
            onExport={() => void createHandler('docx', () => handleExportDOCX(resumeId), 'DOCX')()}
          />
          <FormatCard
            icon={Code}
            title={t('resume.export.format.json')}
            description={t('resume.export.format.jsonDesc')}
            isPending={pending.json ?? false}
            onExport={() =>
              void createHandler('json', () => handleExportJSON(resumeId, jsonFormat), 'JSON')()
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
            isPending={pending.latex ?? false}
            onExport={() =>
              void createHandler(
                'latex',
                () => handleExportLaTeX(resumeId, latexTemplate),
                'LaTeX',
              )()
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
            isPending={pending.banner ?? false}
            onExport={() =>
              void createHandler('banner', () => handleExportBanner(resumeId), 'Banner')()
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
