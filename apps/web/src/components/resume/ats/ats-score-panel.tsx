'use client';

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileUp,
  Info,
  RefreshCw,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { type DragEvent, useCallback, useRef, useState } from 'react';

import { Badge, Button, Card, CardContent, CardHeader } from '@/shared/components/ui';
import { showToast } from '@/shared/components/ui/toast';

import { useAtsValidation } from '../hooks/use-ats-validation';
import { getScoreBadgeVariant, getScoreGaugeColor } from './score-utils';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface AtsScorePanelProps {
  resumeId: string;
}

type IssueSeverity = 'error' | 'warning' | 'info';

const SEVERITY_CONFIG: Record<
  IssueSeverity,
  { icon: typeof AlertCircle; label: string; badgeVariant: 'error' | 'warning' | 'info' }
> = {
  error: { icon: AlertCircle, label: 'Error', badgeVariant: 'error' },
  warning: { icon: AlertTriangle, label: 'Warning', badgeVariant: 'warning' },
  info: { icon: Info, label: 'Info', badgeVariant: 'info' },
};

function ScoreGauge({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = getScoreGaugeColor(score);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="10"
        />
        <circle
          cx="68"
          cy="68"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 68 68)"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-white">{score}</span>
        <span className="text-xs text-zinc-400">/ 100</span>
      </div>
    </div>
  );
}

export function AtsScorePanel({ resumeId: _resumeId }: AtsScorePanelProps) {
  const { mutateAsync, isPending, data } = useAtsValidation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isValidFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast.error('Unsupported format', 'Please upload a PDF or DOCX file.');
      return false;
    }
    return true;
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      if (isValidFile(file)) setSelectedFile(file);
    },
    [isValidFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleValidate = useCallback(async () => {
    if (!selectedFile) return;
    try {
      await mutateAsync(selectedFile);
      showToast.success('Validation complete');
    } catch {
      showToast.error('Validation failed', 'Please try again.');
    }
  }, [selectedFile, mutateAsync]);

  const handleRevalidate = useCallback(() => {
    setSelectedFile(null);
    fileInputRef.current?.click();
  }, []);

  if (data) {
    const sortedIssues = [...data.issues].sort((a, b) => {
      const order: Record<IssueSeverity, number> = { error: 0, warning: 1, info: 2 };
      return order[a.severity as IssueSeverity] - order[b.severity as IssueSeverity];
    });

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-zinc-400" />
              <h3 className="text-lg font-semibold text-white">ATS Validation</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRevalidate}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Re-validate
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Score */}
            <div className="flex flex-col items-center gap-3 py-2">
              <ScoreGauge score={data.score} />
              <Badge variant={getScoreBadgeVariant(data.score)} size="sm">
                {data.score >= 75 ? 'ATS Compatible' : 'Needs Improvement'}
              </Badge>
              {data.metadata.semanticScore !== undefined && (
                <p className="text-xs text-zinc-500">
                  Semantic score: {data.metadata.semanticScore}%
                </p>
              )}
            </div>

            {/* Issues */}
            {sortedIssues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zinc-300">Issues</h4>
                <ul className="space-y-2">
                  {sortedIssues.map((issue, idx) => {
                    const config = SEVERITY_CONFIG[issue.severity as IssueSeverity];
                    const Icon = config.icon;
                    return (
                      <li
                        key={`${issue.category}-${idx}`}
                        className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                      >
                        <div className="flex items-start gap-2">
                          <Icon
                            className="mt-0.5 h-4 w-4 shrink-0"
                            style={{
                              color: `var(--color-${issue.severity === 'error' ? 'red' : issue.severity === 'warning' ? 'amber' : 'blue'}-400, currentColor)`,
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={config.badgeVariant} size="xs">
                                {issue.category}
                              </Badge>
                              {issue.location && (
                                <span className="text-xs text-zinc-500">{issue.location}</span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-zinc-300">{issue.message}</p>
                            {issue.suggestion && (
                              <p className="mt-1 text-xs text-zinc-500">💡 {issue.suggestion}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {data.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-zinc-300">Suggestions</h4>
                <ul className="space-y-1.5">
                  {data.suggestions.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-zinc-400" />
          <h3 className="text-lg font-semibold text-white">ATS Validation</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            role="button"
            tabIndex={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
              isDragging
                ? 'border-cyan-500/50 bg-cyan-500/5'
                : selectedFile
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
            }`}
          >
            {selectedFile ? (
              <>
                <FileUp className="h-8 w-8 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB — Ready to validate
                  </p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-300">
                    Drop your resume here or click to browse
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">Supports PDF and DOCX</p>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
          </div>

          {/* Validate button */}
          <Button
            fullWidth
            disabled={!selectedFile || isPending}
            loading={isPending}
            onClick={handleValidate}
            leftIcon={isPending ? undefined : <ShieldCheck className="h-4 w-4" />}
          >
            {isPending ? 'Analyzing…' : 'Validate Resume'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
