/**
 * Theme Card Component
 * Beautiful compact theme preview with actions
 */

"use client";

import { cn } from "@/shared/utils";
import type { Theme } from "../../services/theme.types";
import type { ResumeStyleConfig } from "../../types/config";
import {
  Check,
  Pencil,
  Copy,
  Trash2,
  Send,
  Sparkles,
  Globe,
  Lock,
  Clock,
  XCircle,
} from "lucide-react";

interface Props {
  theme: Theme;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onFork?: () => void;
  onSubmitForApproval?: () => void;
  showActions?: boolean;
}

export function ThemeCard({
  theme,
  isActive,
  onSelect,
  onEdit,
  onDelete,
  onFork,
  onSubmitForApproval,
  showActions = true,
}: Props) {
  const isPublic = theme.status === "PUBLISHED";
  const isSystem = theme.isSystemTheme;
  const isPrivate = theme.status === "PRIVATE";
  const isPending = theme.status === "PENDING_APPROVAL";
  const isRejected = theme.status === "REJECTED";

  const canDelete = !isPublic && !isSystem;
  const canDirectEdit = !isPublic && !isSystem;
  const canSubmit = isPrivate && !isSystem;

  // Extract colors from styleConfig for preview
  const styleConfig = theme.styleConfig as Partial<ResumeStyleConfig> | undefined;
  const primaryColor = styleConfig?.tokens?.colors?.colors?.primary ?? "#3B82F6";
  const bgColor = styleConfig?.tokens?.colors?.colors?.background ?? "#FFFFFF";
  const textColor = styleConfig?.tokens?.colors?.colors?.text?.primary ?? "#1E293B";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-200",
        isActive
          ? "border-pf-accent-emphasis ring-pf-accent-emphasis/20 ring-2"
          : "border-pf-border-default hover:border-pf-border-emphasis hover:shadow-md"
      )}
    >
      {/* Main clickable area */}
      <button onClick={onSelect} className="flex w-full items-start gap-3 p-3 text-left">
        {/* Color Preview Mini */}
        <div
          className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow-sm"
          style={{ backgroundColor: bgColor }}
        >
          {/* Mini resume preview */}
          <div className="absolute inset-1 flex flex-col gap-0.5">
            <div className="h-1.5 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
            <div
              className="h-0.5 w-3/4 rounded-sm opacity-60"
              style={{ backgroundColor: textColor }}
            />
            <div
              className="h-0.5 w-1/2 rounded-sm opacity-40"
              style={{ backgroundColor: textColor }}
            />
            <div className="mt-auto flex gap-0.5">
              <div className="h-1 w-1 rounded-full" style={{ backgroundColor: primaryColor }} />
              <div
                className="h-1 w-1 rounded-full opacity-50"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-pf-fg-default truncate text-sm font-semibold">{theme.name}</h3>
            <StatusIcon theme={theme} />
          </div>
          <p className="text-pf-fg-muted mt-0.5 truncate text-xs">
            {theme.description || getCategoryLabel(theme.category)}
          </p>

          {/* Color swatches */}
          <div className="mt-2 flex gap-1">
            <div
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: primaryColor }}
              title="Primary"
            />
            <div
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: bgColor }}
              title="Background"
            />
            <div
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ backgroundColor: textColor }}
              title="Text"
            />
          </div>
        </div>

        {/* Active checkmark */}
        {isActive && (
          <div className="bg-pf-accent-emphasis text-pf-fg-on-emphasis absolute top-2 right-2 rounded-full p-1">
            <Check className="h-3 w-3" />
          </div>
        )}
      </button>

      {/* Actions */}
      {showActions && (
        <div className="border-pf-border-default flex border-t">
          {canDirectEdit ? (
            <ActionButton onClick={onEdit} icon={Pencil} label="Edit" />
          ) : (
            <ActionButton onClick={onFork} icon={Copy} label="Customize" />
          )}

          {canSubmit && (
            <ActionButton
              onClick={onSubmitForApproval}
              icon={Send}
              label="Submit"
              className="text-amber-600"
            />
          )}

          {canDelete && !isPending && (
            <ActionButton
              onClick={onDelete}
              icon={Trash2}
              label="Delete"
              className="text-red-500"
            />
          )}
        </div>
      )}

      {/* Rejection tooltip */}
      {isRejected && theme.rejectionReason && (
        <div className="border-pf-border-default border-t bg-red-50 px-3 py-2">
          <p className="text-xs text-red-700">
            <span className="font-medium">Rejected:</span> {theme.rejectionReason}
          </p>
        </div>
      )}
    </div>
  );
}

function StatusIcon({ theme }: { theme: Theme }) {
  if (theme.isSystemTheme) {
    return (
      <span
        className="bg-pf-accent-subtle text-pf-accent-fg rounded-full p-0.5"
        title="System Theme"
      >
        <Sparkles className="h-3 w-3" />
      </span>
    );
  }
  switch (theme.status) {
    case "PUBLISHED":
      return (
        <span className="rounded-full bg-green-100 p-0.5 text-green-600" title="Public">
          <Globe className="h-3 w-3" />
        </span>
      );
    case "PENDING_APPROVAL":
      return (
        <span className="rounded-full bg-amber-100 p-0.5 text-amber-600" title="Pending Review">
          <Clock className="h-3 w-3" />
        </span>
      );
    case "REJECTED":
      return (
        <span className="rounded-full bg-red-100 p-0.5 text-red-600" title="Rejected">
          <XCircle className="h-3 w-3" />
        </span>
      );
    case "PRIVATE":
    default:
      return (
        <span className="bg-pf-canvas-subtle text-pf-fg-muted rounded-full p-0.5" title="Private">
          <Lock className="h-3 w-3" />
        </span>
      );
  }
}

function ActionButton({
  onClick,
  icon: Icon,
  label,
  className,
}: {
  onClick?: () => void;
  icon: typeof Pencil;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "text-pf-fg-muted hover:bg-pf-canvas-subtle flex flex-1 items-center justify-center gap-1 py-2 text-xs transition-colors",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    PROFESSIONAL: "Professional style",
    CREATIVE: "Creative design",
    TECHNICAL: "Technical focus",
    ACADEMIC: "Academic format",
    MINIMAL: "Minimal & clean",
    MODERN: "Modern layout",
    CLASSIC: "Classic design",
    EXECUTIVE: "Executive style",
  };
  return labels[category] || "Custom theme";
}
