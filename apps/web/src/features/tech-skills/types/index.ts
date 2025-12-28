/**
 * Tech Skills Types
 * Types for tech skills catalog from backend
 */

// Tech Area Types
export type TechAreaType =
  | "DEVELOPMENT"
  | "DEVOPS"
  | "DATA"
  | "SECURITY"
  | "DESIGN"
  | "PRODUCT"
  | "QA"
  | "INFRASTRUCTURE"
  | "OTHER";

export type SkillType =
  | "LANGUAGE"
  | "FRAMEWORK"
  | "LIBRARY"
  | "DATABASE"
  | "TOOL"
  | "PLATFORM"
  | "METHODOLOGY"
  | "SOFT_SKILL"
  | "CERTIFICATION"
  | "OTHER";

// Tech Area DTO
export interface TechAreaDto {
  id: string;
  type: TechAreaType;
  nameEn: string;
  namePtBr: string;
  descriptionEn: string | null;
  descriptionPtBr: string | null;
  icon: string | null;
  color: string | null;
  order: number;
}

// Tech Niche DTO
export interface TechNicheDto {
  id: string;
  slug: string;
  nameEn: string;
  namePtBr: string;
  descriptionEn: string | null;
  descriptionPtBr: string | null;
  icon: string | null;
  color: string | null;
  order: number;
  areaType: TechAreaType;
}

// Tech Skill DTO
export interface TechSkillDto {
  id: string;
  slug: string;
  nameEn: string;
  namePtBr: string;
  type: SkillType;
  icon: string | null;
  color: string | null;
  website: string | null;
  aliases: string[];
  popularity: number;
  niche: {
    slug: string;
    nameEn: string;
    namePtBr: string;
  } | null;
}

// Programming Language DTO
export interface ProgrammingLanguageDto {
  id: string;
  slug: string;
  nameEn: string;
  namePtBr: string;
  color: string | null;
  website: string | null;
  aliases: string[];
  fileExtensions: string[];
  paradigms: string[];
  typing: string | null;
  popularity: number;
}

// Combined search result
export interface TechSkillsSearchResult {
  languages: ProgrammingLanguageDto[];
  skills: TechSkillDto[];
}

// For UI display (with localized name)
export interface TechSkillDisplayItem {
  id: string;
  slug: string;
  name: string; // Localized name based on user's language
  type: "language" | "skill";
  skillType?: SkillType;
  color: string | null;
  category?: string; // Niche or paradigm info
}
