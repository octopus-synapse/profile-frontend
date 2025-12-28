/**
 * Section Style Types
 * Visual configuration for each section type
 */

export interface HeaderStyle {
  layout: "centered" | "left-aligned" | "split" | "card";
  showPhoto: boolean;
  photoShape: "circle" | "square" | "rounded";
  photoSize: "sm" | "md" | "lg";
  photoPosition: "left" | "right" | "top";
  showSocialIcons: boolean;
  socialIconStyle: "filled" | "outline" | "minimal";
  nameSize: "lg" | "xl" | "2xl" | "3xl";
  backgroundStyle: "none" | "accent" | "gradient" | "pattern";
}

export interface SummaryStyle {
  background: "none" | "surface" | "accent-light" | "accent-gradient";
  padding: "sm" | "md" | "lg";
  borderStyle: "none" | "left-accent" | "full" | "top-bottom";
  textAlign: "left" | "center" | "justify";
}

export interface ListSectionStyle {
  layout: "timeline" | "cards" | "list" | "compact" | "grid";
  showTimeline?: boolean;
  columns?: 1 | 2 | 3 | 4;
  cardStyle?: "bordered" | "shadow" | "minimal";
}

export interface SkillsStyle extends ListSectionStyle {
  display: "chips" | "bars" | "dots" | "list" | "grid" | "cloud";
  showLevel: boolean;
  levelDisplay: "bars" | "dots" | "percentage" | "text";
  groupByCategory: boolean;
  chipStyle: "filled" | "outline" | "ghost";
}

export interface TimelineStyle extends ListSectionStyle {
  timelinePosition: "left" | "right";
  showDuration: boolean;
  durationFormat: "years-months" | "dates" | "relative";
  highlightCurrent: boolean;
}

export type SectionStyleMap = {
  header: HeaderStyle;
  summary: SummaryStyle;
  experiences: TimelineStyle;
  education: TimelineStyle;
  skills: SkillsStyle;
  languages: ListSectionStyle;
  certifications: ListSectionStyle;
  projects: ListSectionStyle;
  awards: ListSectionStyle;
  publications: ListSectionStyle;
  talks: ListSectionStyle;
  "open-source": ListSectionStyle;
  hackathons: ListSectionStyle;
  "bug-bounties": ListSectionStyle;
  interests: ListSectionStyle;
  recommendations: ListSectionStyle;
  achievements: ListSectionStyle;
};
