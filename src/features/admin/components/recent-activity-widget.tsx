"use client";

/**
 * Recent Activity Widget
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
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
    color: "text-gh-success-fg",
    bgColor: "bg-gh-success-subtle",
    label: "signed up",
  },
  USER_LOGIN: {
    icon: LogIn,
    color: "text-gh-accent-fg",
    bgColor: "bg-gh-accent-subtle",
    label: "logged in",
  },
  RESUME_CREATED: {
    icon: FileText,
    color: "text-gh-done-fg",
    bgColor: "bg-gh-done-subtle",
    label: "created a resume",
  },
  PROFILE_UPDATED: {
    icon: User,
    color: "text-gh-attention-fg",
    bgColor: "bg-gh-attention-subtle",
    label: "updated profile",
  },
};

export function RecentActivityWidget({ activities, loading }: RecentActivityWidgetProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="mt-0.5 h-8 w-8 rounded-full" />
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
        <CardTitle>Recent Activity</CardTitle>
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
                  <div className={cn("mt-0.5 rounded-full p-2", config.bgColor)}>
                    <Icon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gh-fg-default text-sm">
                      <span className="font-medium">{activity.userName}</span>{" "}
                      <span className="text-gh-fg-muted">{config.label}</span>
                    </p>
                    <p className="text-gh-fg-subtle mt-0.5 text-xs">
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
