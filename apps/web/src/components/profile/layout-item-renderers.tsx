/**
 * Layout item renderer components for public profile resume.
 */

import type { ResumeItemDto } from '@profile/api-client';
import type { FieldStyleMap } from './public-profile-types';
import {
  findAllFieldsByRole,
  findFieldByRole,
  formatDateRange,
  getContentObject,
} from './public-profile-utils';

export function TimelineItem({
  item,
  fieldStyles,
}: {
  item: ResumeItemDto;
  fieldStyles: FieldStyleMap;
}) {
  const content = getContentObject(item);
  const titleText = findFieldByRole(content, fieldStyles, 'title');
  const subtitle = findFieldByRole(content, fieldStyles, 'subtitle');
  const dates = findAllFieldsByRole(content, fieldStyles, 'date', 'dateRange');
  const location = findFieldByRole(content, fieldStyles, 'location');
  const description = findFieldByRole(content, fieldStyles, 'description');
  const isCurrent = content.current === true || content.isCurrent === true;

  return (
    <div className="border-pf-border-default relative border-l-2 pl-6">
      <div className="bg-pf-accent-emphasis ring-pf-canvas-default absolute top-0 -left-[9px] h-4 w-4 rounded-full ring-4" />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {titleText && <h4 className="text-pf-fg-default font-semibold">{titleText}</h4>}
          {subtitle && <p className="text-pf-accent-fg font-medium">{subtitle}</p>}
        </div>
        {dates.length > 0 && (
          <span className="text-pf-fg-muted shrink-0 text-sm">
            {formatDateRange(dates, isCurrent)}
          </span>
        )}
      </div>
      {location && <p className="text-pf-fg-subtle mt-1 text-sm">{location}</p>}
      {description && (
        <p className="text-pf-fg-muted mt-3 text-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export function CardItem({
  item,
  fieldStyles,
}: {
  item: ResumeItemDto;
  fieldStyles: FieldStyleMap;
}) {
  const content = getContentObject(item);
  const titleText =
    findFieldByRole(content, fieldStyles, 'title') || findFieldByRole(content, fieldStyles, 'chip');
  const badge = findFieldByRole(content, fieldStyles, 'badge');

  return (
    <div className="bg-pf-canvas-subtle ring-pf-border-default flex items-center justify-between rounded-lg p-4 ring-1">
      <span className="text-pf-fg-default font-medium">{titleText}</span>
      {badge && <span className="text-pf-fg-muted text-sm capitalize">{badge}</span>}
    </div>
  );
}

export function CompactItem({
  item,
  fieldStyles,
}: {
  item: ResumeItemDto;
  fieldStyles: FieldStyleMap;
}) {
  const content = getContentObject(item);
  const name =
    findFieldByRole(content, fieldStyles, 'chip') || findFieldByRole(content, fieldStyles, 'title');
  const badge = findFieldByRole(content, fieldStyles, 'badge');

  const levelMap: Record<string, number> = { BEGINNER: 1, INTERMEDIATE: 2, ADVANCED: 3, EXPERT: 4 };
  const numericLevel = badge ? (levelMap[badge.toUpperCase()] ?? 0) : 0;

  return (
    <span className="bg-pf-canvas-subtle text-pf-fg-default ring-pf-border-default inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1">
      {name}
      {numericLevel > 0 && (
        <span className="flex gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${i <= numericLevel ? 'bg-pf-accent-emphasis' : 'bg-pf-border-default'}`}
            />
          ))}
        </span>
      )}
    </span>
  );
}

export function ListItem({
  item,
  fieldStyles,
}: {
  item: ResumeItemDto;
  fieldStyles: FieldStyleMap;
}) {
  const content = getContentObject(item);
  const titleText = findFieldByRole(content, fieldStyles, 'title');
  const description = findFieldByRole(content, fieldStyles, 'description');

  const fallbackText =
    titleText ||
    (Object.values(content).find((v) => typeof v === 'string' && v) as string) ||
    'Item';

  return (
    <div className="border-pf-border-default rounded-lg border p-4">
      <p className="text-pf-fg-default font-medium">{fallbackText}</p>
      {description && <p className="text-pf-fg-muted mt-1 text-sm">{description}</p>}
    </div>
  );
}
