/**
 * Theme Card
 * Elegant compact theme preview
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

  // Extract colors from styleConfig
  const styleConfig = theme.styleConfig as Partial<ResumeStyleConfig> | undefined;
  const primaryColor = styleConfig?.tokens?.colors?.colors?.primary ?? "#3B82F6";
  const bgColor = styleConfig?.tokens?.colors?.colors?.background ?? "#FFFFFF";
  const textColor = styleConfig?.tokens?.colors?.colors?.text?.primary ?? "#1E293B";

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg border transition-all",
        isActive
          ? "border-pf-border-emphasis ring-pf-border-emphasis/10 ring-2"
          : "border-pf-border-default hover:border-pf-border-emphasis/50"
      )}
    >
      {/* Clickable area */}
      <button onClick={onSelect} className="flex w-full items-start gap-3 p-3 text-left">
        {/* Color preview */}
        <div
          className="ring-pf-border-subtle relative h-12 w-12 shrink-0 overflow-hidden rounded-md shadow-sm ring-1"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute inset-1 flex flex-col gap-0.5">
            <div className="h-1 w-full rounded-sm" style={{ backgroundColor: primaryColor }} />
            <div
              className="h-0.5 w-3/4 rounded-sm opacity-50"
              style={{ backgroundColor: textColor }}
            />
            <div
              className="h-0.5 w-1/2 rounded-sm opacity-30"
              style={{ backgroundColor: textColor }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-pf-fg-default truncate text-sm font-medium">{theme.name}</h3>
            <StatusIcon theme={theme} />
          </div>
          <p className="text-pf-fg-muted mt-0.5 truncate text-xs">
            {theme.description || getCategoryLabel(theme.category)}
          </p>

          {/* Swatches */}
          <div className="mt-1.5 flex gap-1">
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: primaryColor }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: bgColor }}
            />
            <div
              className="h-2.5 w-2.5 rounded-full ring-1 ring-black/5"
              style={{ backgroundColor: textColor }}
            />
          </div>
        </div>

        {/* Active check */}
        {isActive && (
          <div className="bg-pf-canvas-emphasis absolute top-2 right-2 rounded-full p-1">
            <Check className="text-pf-fg-on-emphasis h-3 w-3" strokeWidth={2} />
          </div>
        )}
      </button>

      {/* Actions */}
      {showActions && (
        <div className="border-pf-border-muted flex border-t">
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
              className="text-pf-attention-fg"
            />
          )}

          {canDelete && !isPending && (
            <ActionButton
              onClick={onDelete}
              icon={Trash2}
              label="Delete"
              className="text-pf-danger-fg"
            />
          )}
        </div>
      )}

      {/* Rejection note */}
      {isRejected && theme.rejectionReason && (
        <div className="border-pf-danger-muted bg-pf-danger-subtle border-t px-3 py-2">
          <p className="text-pf-danger-fg text-xs">
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
      <span className="bg-pf-canvas-subtle text-pf-fg-muted rounded-full p-0.5" title="System">
        <Sparkles className="h-3 w-3" strokeWidth={1.5} />
      </span>
    );
  }
  switch (theme.status) {
    case "PUBLISHED":
      return (
        <span className="bg-pf-success-subtle text-pf-success-fg rounded-full p-0.5" title="Public">
          <Globe className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    case "PENDING_APPROVAL":
      return (
        <span
          className="bg-pf-attention-subtle text-pf-attention-fg rounded-full p-0.5"
          title="Pending"
        >
          <Clock className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    case "REJECTED":
      return (
        <span className="bg-pf-danger-subtle text-pf-danger-fg rounded-full p-0.5" title="Rejected">
          <XCircle className="h-3 w-3" strokeWidth={1.5} />
        </span>
      );
    default:
      return (
        <span className="bg-pf-canvas-subtle text-pf-fg-muted rounded-full p-0.5" title="Private">
          <Lock className="h-3 w-3" strokeWidth={1.5} />
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
        "text-pf-fg-muted hover:bg-pf-canvas-subtle hover:text-pf-fg-default flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors",
        className
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={1.5} />
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
