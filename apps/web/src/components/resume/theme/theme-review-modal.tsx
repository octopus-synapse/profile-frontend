/**
 * Theme Review Modal Component
 * For approvers to approve/reject themes
 */

'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { useThemesReview } from '@profile/api-client';
import { useI18n } from '@profile/i18n';
import { useState } from 'react';
import type { ResumeStyleConfig, Theme } from '../types/config';
import { ThemePreview } from './theme-preview';

interface Props {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeReviewModal({ theme, isOpen, onClose }: Props) {
  const { t } = useI18n();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const reviewMutation = useThemesReview();

  if (!isOpen) return null;

  const handleApprove = async () => {
    await reviewMutation.mutateAsync({
      data: { themeId: theme.id, approved: true },
    });
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    await reviewMutation.mutateAsync({
      data: { themeId: theme.id, approved: false, rejectionReason },
    });
    onClose();
    setRejectionReason('');
    setShowRejectForm(false);
  };

  const isPending = reviewMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Review Theme: {theme.name}</h2>
          <Button
            type="button"
            variant="ghost"
            tone="neutral"
            size="xs"
            iconOnly
            aria-label="Close"
            onPress={onClose}
          >
            ✕
          </Button>
        </div>

        {/* Content */}
        <div className="flex gap-6 overflow-auto p-6">
          {/* Preview */}
          <div className="w-64 flex-shrink-0">
            <ThemePreview
              config={theme.styleConfig as unknown as ResumeStyleConfig}
              className="border shadow-sm"
            />
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Author:</span>{' '}
                {theme.author?.name || 'Unknown'}
              </p>
              <p>
                <span className="text-muted-foreground">Category:</span> {theme.category}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{' '}
                {theme.createdAt ? new Date(theme.createdAt).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium">{t('resume.theme.review.description')}</h3>
              <p className="text-muted-foreground text-sm">
                {theme.description || 'No description provided'}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Tags</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {theme.tags && theme.tags.length > 0 ? (
                  theme.tags.map((tag) => (
                    <span key={tag} className="bg-muted rounded px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">
                    {t('resume.theme.review.noTags')}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium">{t('resume.theme.review.styleConfig')}</h3>
              <pre className="bg-muted mt-1 max-h-48 overflow-auto rounded p-3 text-xs">
                {JSON.stringify(theme.styleConfig, null, 2)}
              </pre>
            </div>

            {/* Rejection form */}
            {showRejectForm && (
              <div className="border-pf-danger-muted bg-pf-danger-subtle rounded border p-4">
                <label className="text-pf-danger-emphasis mb-2 block text-sm font-medium">
                  {t('resume.theme.review.rejectionReason')}
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="border-pf-border-default bg-pf-canvas-default w-full rounded border p-2 text-sm"
                  rows={3}
                  placeholder={t('resume.theme.review.rejectPlaceholder')}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <Button
            type="button"
            variant="outline"
            tone="neutral"
            size="sm"
            disabled={isPending}
            onPress={onClose}
          >
            {t('action.cancel')}
          </Button>
          {showRejectForm ? (
            <>
              <Button
                type="button"
                variant="link"
                tone="neutral"
                size="sm"
                disabled={isPending}
                onPress={() => setShowRejectForm(false)}
              >
                {t('action.back')}
              </Button>
              <Button
                type="button"
                variant="solid"
                tone="danger"
                size="sm"
                loading={reviewMutation.isPending}
                disabled={!rejectionReason.trim()}
                onPress={() => void handleReject()}
              >
                Confirm Rejection
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                tone="danger"
                size="sm"
                disabled={isPending}
                onPress={() => setShowRejectForm(true)}
              >
                {t('resume.theme.review.reject')}
              </Button>
              <Button
                type="button"
                variant="solid"
                tone="success"
                size="sm"
                loading={reviewMutation.isPending}
                onPress={() => void handleApprove()}
              >
                Approve & Publish
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
