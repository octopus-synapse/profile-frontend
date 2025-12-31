"use client";

/**
 * Recent Activity Widget
 * Clean, professional design
 */

import { Card, CardContent, CardHeader, CardTitle, Skeleton } from "@/shared/components/ui";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Activity, UserPlus, LogIn, FileText, User } from "lucide-react";
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
    bgColor: "bg-pf-success-subtle",
    label: "signed up",
  },
  USER_LOGIN: {
    icon: LogIn,
    color: "text-pf-accent-fg",
    bgColor: "bg-pf-accent-subtle",
    label: "logged in",
  },
  RESUME_CREATED: {
    icon: FileText,
    color: "text-pf-done-fg",
    bgColor: "bg-pf-done-subtle",
    label: "created a resume",
  },
  PROFILE_UPDATED: {
    icon: User,
    color: "text-pf-attention-fg",
    bgColor: "bg-pf-attention-subtle",
    label: "updated profile",
  },
};

export function RecentActivityWidget({ activities, loading }: RecentActivityWidgetProps) {
  if (loading) {
    return (
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
            <span className="text-pf-fg-default text-sm font-semibold">Recent Activity</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="mt-0.5 h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="text-pf-fg-muted h-4 w-4" strokeWidth={1.5} />
          <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
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
                  <div
                    className={cn(
                      "mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg",
                      config.bgColor
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-pf-fg-default text-sm">
                      <span className="font-medium">{activity.userName}</span>{" "}
                      <span className="text-pf-fg-muted">{config.label}</span>
                    </p>
                    <p className="text-pf-fg-subtle mt-0.5 text-xs">
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
