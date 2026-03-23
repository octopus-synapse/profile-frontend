import {
  Award,
  BookOpen,
  Briefcase,
  Bug,
  Code,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  MessageSquare,
  Mic,
  Rocket,
  Scroll,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';

const LUCIDE_MAP: Record<string, typeof FileText> = {
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  zap: Zap,
  languages: Languages,
  'file-text': FileText,
  'message-square': MessageSquare,
  heart: Heart,
  star: Star,
  award: Award,
  'book-open': BookOpen,
  code: Code,
  bug: Bug,
  mic: Mic,
  trophy: Trophy,
  users: Users,
  globe: Globe,
  rocket: Rocket,
  scroll: Scroll,
};

interface SectionIconProps {
  iconType: string;
  icon: string;
  className?: string;
  size?: number;
}

export function SectionIcon({ iconType, icon, className, size = 18 }: SectionIconProps) {
  if (iconType === 'emoji') {
    return <span className={className} style={{ fontSize: size }}>{icon}</span>;
  }

  if (iconType === 'lucide') {
    const LucideIcon = LUCIDE_MAP[icon] ?? FileText;
    return <LucideIcon className={className} size={size} strokeWidth={1.5} />;
  }

  return <span className={className} style={{ fontSize: size }}>📄</span>;
}
