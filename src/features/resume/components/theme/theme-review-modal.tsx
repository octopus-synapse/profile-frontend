/**
 * Theme Review Modal Component
 * For approvers to approve/reject themes
 */

"use client";

import { useState } from "react";
import { useApproveTheme, useRejectTheme } from "../../hooks";
import type { Theme } from "../../services/theme.types";
import { ThemePreview } from "./theme-preview";
import type { ResumeStyleConfig } from "../../types/config";

interface Props {
  theme: Theme;
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeReviewModal({ theme, isOpen, onClose }: Props) {
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const approveTheme = useApproveTheme();
  const rejectTheme = useRejectTheme();

  if (!isOpen) return null;

  const handleApprove = async () => {
    await approveTheme.mutateAsync(theme.id);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    await rejectTheme.mutateAsync({ themeId: theme.id, reason: rejectionReason });
    onClose();
    setRejectionReason("");
    setShowRejectForm(false);
  };

  const isPending = approveTheme.isPending || rejectTheme.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Review Theme: {theme.name}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            ✕
          </button>
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
                <span className="text-muted-foreground">Author:</span>{" "}
                {theme.author?.name || "Unknown"}
              </p>
              <p>
                <span className="text-muted-foreground">Category:</span> {theme.category}
              </p>
              <p>
                <span className="text-muted-foreground">Created:</span>{" "}
                {new Date(theme.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-muted-foreground text-sm">
                {theme.description || "No description provided"}
              </p>
            </div>

            <div>
              <h3 className="font-medium">Tags</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {theme.tags.length > 0 ? (
                  theme.tags.map((tag) => (
                    <span key={tag} className="bg-muted rounded px-2 py-0.5 text-xs">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">No tags</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium">Style Configuration</h3>
              <pre className="bg-muted mt-1 max-h-48 overflow-auto rounded p-3 text-xs">
                {JSON.stringify(theme.styleConfig, null, 2)}
              </pre>
            </div>

            {/* Rejection form */}
            {showRejectForm && (
              <div className="rounded border border-red-200 bg-red-50 p-4">
                <label className="mb-2 block text-sm font-medium text-red-800">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full rounded border p-2 text-sm"
                  rows={3}
                  placeholder="Explain why this theme is being rejected..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t p-4">
          <button
            onClick={onClose}
            className="hover:bg-muted rounded border px-4 py-2 text-sm"
            disabled={isPending}
          >
            Cancel
          </button>
          {showRejectForm ? (
            <>
              <button
                onClick={() => setShowRejectForm(false)}
                className="text-muted-foreground px-4 py-2 text-sm hover:underline"
                disabled={isPending}
              >
                Back
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim() || isPending}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                {rejectTheme.isPending ? "Rejecting..." : "Confirm Rejection"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowRejectForm(true)}
                className="rounded border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                disabled={isPending}
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isPending}
                className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
              >
                {approveTheme.isPending ? "Approving..." : "Approve & Publish"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
