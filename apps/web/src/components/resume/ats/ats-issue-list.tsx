/**
 * AtsIssueList — displays validation issues from ATS scan.
 */

import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/shared/components/ui';
import { getSeverityIconColor } from './score-utils';

type IssueSeverity = 'error' | 'warning' | 'info';

const SEVERITY_CONFIG: Record<
  IssueSeverity,
  { icon: typeof AlertCircle; badgeVariant: 'error' | 'warning' | 'info' }
> = {
  error: { icon: AlertCircle, badgeVariant: 'error' },
  warning: { icon: AlertTriangle, badgeVariant: 'warning' },
  info: { icon: Info, badgeVariant: 'info' },
};

interface Issue {
  severity: string;
  category?: string;
  message: string;
  location?: string;
  suggestion?: string;
}

interface Props {
  issues: Issue[];
  suggestions: string[];
}

function sortBySeverity(issues: Issue[]): Issue[] {
  const order: Record<IssueSeverity, number> = { error: 0, warning: 1, info: 2 };
  return [...issues].sort(
    (a, b) => order[a.severity as IssueSeverity] - order[b.severity as IssueSeverity],
  );
}

function IssueItem({ issue }: { issue: Issue }) {
  const config = SEVERITY_CONFIG[issue.severity as IssueSeverity];
  const Icon = config.icon;

  return (
    <li className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
      <div className="flex items-start gap-2">
        <Icon
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ color: getSeverityIconColor(issue.severity) }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {issue.category && (
              <Badge variant={config.badgeVariant} size="xs">
                {issue.category}
              </Badge>
            )}
            {issue.location && <span className="text-xs text-zinc-500">{issue.location}</span>}
          </div>
          <p className="mt-1 text-sm text-zinc-300">{issue.message}</p>
          {issue.suggestion && <p className="mt-1 text-xs text-zinc-500">💡 {issue.suggestion}</p>}
        </div>
      </div>
    </li>
  );
}

export function AtsIssueList({ issues, suggestions }: Props) {
  const sortedIssues = sortBySeverity(issues);

  return (
    <div className="space-y-6">
      {sortedIssues.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-300">Issues</h4>
          <ul className="space-y-2">
            {sortedIssues.map((issue, idx) => (
              <IssueItem key={`${issue.category}-${idx}`} issue={issue} />
            ))}
          </ul>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-300">Suggestions</h4>
          <ul className="space-y-1.5">
            {suggestions.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
