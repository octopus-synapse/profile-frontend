/**
 * Section Style Types
 * Visual configuration for section rendering
 *
 * NOTE: These are generic style options that can be applied to any section
 * based on its semanticKind (HEADER, SUMMARY, LIST).
 */

/** Style for header sections (semanticKind: HEADER) */
export interface HeaderStyle {
  layout: 'centered' | 'left-aligned' | 'split' | 'card';
  showPhoto: boolean;
  photoShape: 'circle' | 'square' | 'rounded';
  photoSize: 'sm' | 'md' | 'lg';
  photoPosition: 'left' | 'right' | 'top';
  showSocialIcons: boolean;
  socialIconStyle: 'filled' | 'outline' | 'minimal';
  nameSize: 'lg' | 'xl' | '2xl' | '3xl';
  backgroundStyle: 'none' | 'accent' | 'gradient' | 'pattern';
}

/** Style for summary sections (semanticKind: SUMMARY) */
export interface SummaryStyle {
  background: 'none' | 'surface' | 'accent-light' | 'accent-gradient';
  padding: 'sm' | 'md' | 'lg';
  borderStyle: 'none' | 'left-accent' | 'full' | 'top-bottom';
  textAlign: 'left' | 'center' | 'justify';
}

/** Base style for list sections (semanticKind: LIST) */
export interface ListSectionStyle {
  layout: 'timeline' | 'cards' | 'list' | 'compact' | 'grid';
  showTimeline?: boolean;
  columns?: 1 | 2 | 3 | 4;
  cardStyle?: 'bordered' | 'shadow' | 'minimal';
}

/** Extended style for skills-like sections with special display options */
export interface SkillsStyle extends ListSectionStyle {
  display: 'chips' | 'bars' | 'dots' | 'list' | 'grid' | 'cloud';
  showLevel: boolean;
  levelDisplay: 'bars' | 'dots' | 'percentage' | 'text';
  groupByCategory: boolean;
  chipStyle: 'filled' | 'outline' | 'ghost';
}

/** Extended style for timeline sections (experiences, education) */
export interface TimelineStyle extends ListSectionStyle {
  timelinePosition: 'left' | 'right';
  showDuration: boolean;
  durationFormat: 'years-months' | 'dates' | 'relative';
  highlightCurrent: boolean;
}

/** Union of all possible section styles */
export type AnySectionStyle =
  | HeaderStyle
  | SummaryStyle
  | ListSectionStyle
  | SkillsStyle
  | TimelineStyle;
