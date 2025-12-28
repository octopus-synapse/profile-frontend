"use client";

/**
 * Admin Theme Approvals Page
 * Review and manage user-submitted themes
 */

import { Code2, Palette, Check, X, Clock } from "lucide-react";
import { ThemeApprovalQueue, usePendingThemes } from "@/features/resume";

export default function ThemeApprovalsClient() {
  const { data: pendingThemes } = usePendingThemes();
  const pendingCount = pendingThemes?.length ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="mb-4 inline-flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-muted font-mono text-xs">{"// Theme Management"}</span>
        </div>
        <h1 className="text-pf-fg-default text-2xl font-bold">
          themes<span className="text-pf-fg-muted font-normal">.review()</span>
        </h1>
        <p className="text-pf-fg-muted mt-1 font-mono text-sm">
          Review and approve user-submitted themes for public use
        </p>
      </div>

      {/* Quick Status Terminal */}
      <div className="terminal">
        <div className="terminal-header">
          <div className="code-block-dots">
            <span className="code-block-dot red" />
            <span className="code-block-dot yellow" />
            <span className="code-block-dot green" />
          </div>
          <span className="code-block-title">~/admin/themes/queue</span>
        </div>
        <div className="terminal-content">
          <div>
            <span className="terminal-prompt">➜</span>{" "}
            <span className="terminal-command">themes pending --count</span>
          </div>
          <div className="terminal-output mt-2">
            {pendingCount > 0 ? (
              <div className="text-pf-attention-fg">
                <Clock className="mr-2 inline-block h-4 w-4" />
                {pendingCount} theme{pendingCount !== 1 ? "s" : ""} pending review
              </div>
            ) : (
              <div className="text-pf-success-fg">
                <Check className="mr-2 inline-block h-4 w-4" />
                All themes reviewed. Queue is empty.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard label="pending" value={pendingCount} icon={Clock} variant="attention" />
        <StatsCard label="approved_today" value={0} icon={Check} variant="success" />
        <StatsCard label="rejected_today" value={0} icon={X} variant="danger" />
      </div>

      {/* Approval Queue */}
      <div className="border-pf-border-default rounded-lg border p-6">
        <div className="mb-4 flex items-center gap-2">
          <Palette className="text-pf-fg-muted h-5 w-5" strokeWidth={1.5} />
          <span className="text-pf-fg-default font-mono text-sm font-medium">
            pending_reviews[]
          </span>
        </div>
        <ThemeApprovalQueue />
      </div>
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  variant: "attention" | "success" | "danger";
}

function StatsCard({ label, value, icon: Icon, variant }: StatsCardProps) {
  const variantStyles = {
    attention: "text-pf-attention-fg",
    success: "text-pf-success-fg",
    danger: "text-pf-danger-fg",
  };

  return (
    <div className="border-pf-border-default bg-pf-canvas-subtle rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-pf-fg-muted font-mono text-xs">{label}</p>
          <p className={`text-2xl font-bold ${variantStyles[variant]}`}>{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${variantStyles[variant]} opacity-50`} strokeWidth={1.5} />
      </div>
    </div>
  );
}
