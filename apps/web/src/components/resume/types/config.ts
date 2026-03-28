/**
 * Resume Style Config Types
 *
 * Note: These types should eventually be generated from the backend schema.
 * For now, they serve as frontend-only type definitions.
 */

/**
 * Theme type - SDK provides { [key: string]: unknown } which is unusable.
 * This interface provides proper typing until backend generates proper types.
 */
export interface Theme {
  id: string;
  name: string;
  description?: string | null;
  category?: string;
  tags?: string[];
  status?: 'DRAFT' | 'PENDING' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'REJECTED' | 'PRIVATE';
  isSystemTheme?: boolean;
  styleConfig?: ResumeStyleConfig | Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  author?: { id: string; name?: string };
  rejectionReason?: string | null;
}

export interface ColorTokens {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string | { primary?: string; secondary?: string };
  muted?: string;
  border?: string;
  colors?: {
    primary?: string;
    background?: string;
    text?: { primary?: string };
  };
  borderRadius?: string;
}

export interface TypographyTokens {
  fontFamily?: string;
  headingFontFamily?: string;
  baseFontSize?: string;
  lineHeight?: number;
  headingScale?: number;
}

export interface LayoutConfig {
  type?: 'single-column' | 'two-column';
  pageSize?: 'A4' | 'LETTER' | 'LEGAL';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  columns?: number;
  sectionSpacing?: number;
}

export interface SpacingConfig {
  sectionGap?: number;
  itemGap?: number;
  contentPadding?: number;
}

export interface SectionStyleConfig {
  headerClass?: string;
  itemClass?: string;
  containerClass?: string;
  dividerClass?: string;
  visible?: boolean;
  order?: number;
}

export interface ResumeStyleConfig {
  colors?: ColorTokens;
  typography?: TypographyTokens;
  layout?: LayoutConfig;
  spacing?: SpacingConfig;
  tokens?: {
    colors?: ColorTokens;
    typography?: TypographyTokens;
    spacing?: {
      density?: 'compact' | 'normal' | 'relaxed';
    };
  };
  sections?: Record<string, SectionStyleConfig>;
}
