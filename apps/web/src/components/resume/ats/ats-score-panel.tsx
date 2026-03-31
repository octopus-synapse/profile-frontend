'use client';

/**
 * AtsScorePanel — ATS validation results and file upload.
 * Uses SDK hook directly.
 */

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  showToast,
} from '@octopus-synapse/profile-ui';
import { useAtsValidationValidateCV } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { RefreshCw, ShieldCheck } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { AtsIssueList } from './ats-issue-list';
import { FileDropZone } from './file-drop-zone';
import { ScoreGauge } from './score-gauge';
import { type AtsValidationResult, getScoreBadgeVariant } from './score-utils';

interface Props {
  resumeId: string;
}

export function AtsScorePanel({ resumeId }: Props) {
  const { t } = useI18n();
  const validateMutation = useAtsValidationValidateCV();
  const [validationResult, setValidationResult] = useState<AtsValidationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleValidate = useCallback(async () => {
    try {
      // Validate stored resume using resumeId
      const response = await validateMutation.mutateAsync({
        data: {
          resumeId,
          checkFormat: true,
          checkSections: true,
          checkGrammar: true,
          checkLayout: true,
        },
      });
      const result = response.data?.data as AtsValidationResult | undefined;
      if (result) {
        setValidationResult(result);
      }
      showToast.success('Validation complete');
    } catch {
      showToast.error('Validation failed', 'Please try again.');
    }
  }, [resumeId, validateMutation]);

  const handleRevalidate = useCallback(() => {
    setSelectedFile(null);
    setValidationResult(null);
    fileInputRef.current?.click();
  }, []);

  if (validationResult) {
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
              {t('resume.ats.revalidate')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-3 py-2">
              <ScoreGauge score={validationResult.score} />
              <Badge variant={getScoreBadgeVariant(validationResult.score)} size="sm">
                {validationResult.score >= 75 ? 'ATS Compatible' : 'Needs Improvement'}
              </Badge>
              {validationResult.metadata.semanticScore !== undefined && (
                <p className="text-xs text-zinc-500">
                  Semantic score: {validationResult.metadata.semanticScore}%
                </p>
              )}
            </div>
            <AtsIssueList
              issues={validationResult.issues}
              suggestions={validationResult.suggestions}
            />
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
          <FileDropZone
            selectedFile={selectedFile}
            inputRef={fileInputRef}
            onFileSelect={setSelectedFile}
          />
          <Button
            fullWidth
            disabled={!selectedFile || validateMutation.isPending}
            loading={validateMutation.isPending}
            onClick={handleValidate}
            leftIcon={validateMutation.isPending ? undefined : <ShieldCheck className="h-4 w-4" />}
          >
            {validateMutation.isPending ? 'Analyzing…' : 'Validate Resume'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
