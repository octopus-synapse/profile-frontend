"use client";

/**
 * Recent Activity Widget
 * Developer-inspired design with code aesthetic
 */

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/components/ui";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Activity, UserPlus, LogIn, FileText, User, Code2 } from "lucide-react";
import { formatDistanceToNow } from "@/shared/utils";
import { cn } from "@/shared/utils";
import type { RecentActivity } from "../types";

interface RecentActivityWidgetProps {
  activities?: RecentActivity[];
  loading?: boolean;
}

const activityConfig = {
  USER_REGISTERED: {
    icon: UserPlus,
    color: "text-pf-success-fg",
    bgColor: "bg-pf-canvas-emphasis",
    textColor: "text-pf-fg-on-emphasis",
    label: "signed_up",
  },
  USER_LOGIN: {
    icon: LogIn,
    color: "text-pf-accent-fg",
    bgColor: "bg-pf-canvas-emphasis",
    textColor: "text-pf-fg-on-emphasis",
    label: "logged_in",
  },
  RESUME_CREATED: {
    icon: FileText,
    color: "text-pf-done-fg",
    bgColor: "bg-pf-canvas-emphasis",
    textColor: "text-pf-fg-on-emphasis",
    label: "created_resume",
  },
  PROFILE_UPDATED: {
    icon: User,
    color: "text-pf-attention-fg",
    bgColor: "bg-pf-canvas-emphasis",
    textColor: "text-pf-fg-on-emphasis",
    label: "updated_profile",
  },
};

export function RecentActivityWidget({ activities, loading }: RecentActivityWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-muted font-mono text-xs">// recent_activity</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="mt-0.5 h-8 w-8" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code2 className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="font-mono text-sm">recent_activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {!activities || activities.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No activity yet"
            description="User activity will appear here"
            className="py-8"
          />
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => {
              const config = activityConfig[activity.type];
              const Icon = config.icon;

              return (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={cn("mt-0.5 p-2", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.textColor)} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-pf-fg-default font-mono text-sm">
                      <span className="font-semibold">{activity.userName}</span>{" "}
                      <span className="text-pf-fg-muted">{config.label}</span>
                    </p>
                    <p className="text-pf-fg-subtle mt-0.5 font-mono text-xs">
                      {formatDistanceToNow(new Date(activity.timestamp))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
