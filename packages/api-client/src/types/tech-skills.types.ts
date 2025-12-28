/**
 * Tech Skills Domain Types
 * API types for tech skills catalog
 */

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

export interface TechArea {
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

export interface TechNiche {
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

export interface TechSkill {
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

export interface ProgrammingLanguage {
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

export interface TechSkillsSearchResult {
  languages: ProgrammingLanguage[];
  skills: TechSkill[];
}
