/**
 * FileDropZone — drag-and-drop file upload zone.
 */
'use client';

import { showToast } from '@octopus-synapse/profile-ui';
import { useI18n } from '@profile/i18n';
import { FileUp, Upload } from 'lucide-react';
import { type DragEvent, type RefObject, useCallback, useState } from 'react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

interface Props {
  selectedFile: File | null;
  inputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (file: File) => void;
}

export function FileDropZone({ selectedFile, inputRef, onFileSelect }: Props) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);

  const isValidFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast.error('Unsupported format', 'Please upload a PDF or DOCX file.');
      return false;
    }
    return true;
  }, []);

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
      if (file && isValidFile(file)) onFileSelect(file);
    },
    [isValidFile, onFileSelect],
  );

  const handleClick = () => inputRef.current?.click();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
  };

  const getZoneClasses = () => {
    if (isDragging) return 'border-cyan-500/50 bg-cyan-500/5';
    if (selectedFile) return 'border-emerald-500/30 bg-emerald-500/5';
    return 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]';
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${getZoneClasses()}`}
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
            <p className="text-sm font-medium text-zinc-300">{t('resume.ats.dropzone')}</p>
            <p className="mt-1 text-xs text-zinc-500">{t('resume.ats.supportedFormats')}</p>
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && isValidFile(file)) onFileSelect(file);
        }}
      />
    </div>
  );
}
