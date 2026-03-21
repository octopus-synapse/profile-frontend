import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  FileText,
  FolderOpen,
  GraduationCap,
  Heart,
  Languages,
  MessageSquare,
  Mic,
  ShieldCheck,
  Trophy,
  Zap,
} from 'lucide-react';

export const SECTION_ICONS: Record<string, typeof Briefcase> = {
  work_experience_v1: Briefcase,
  education_v1: GraduationCap,
  skill_set_v1: Zap,
  language_v1: Languages,
  summary_v1: FileText,
  achievements: Trophy,
  awards: Award,
  certs: ShieldCheck,
  projects: FolderOpen,
  'open source': Code,
  'bug bounty': ShieldCheck,
  hackathons: Code,
  publications: BookOpen,
  talks: Mic,
  recommendation_v1: MessageSquare,
  interest_v1: Heart,
};

export const SECTION_ICON_FALLBACK = FileText;
