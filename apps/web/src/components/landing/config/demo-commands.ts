import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Download, FileText, Layout, Sparkles, Wand2 } from 'lucide-react';

export interface DemoCommand {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  previewType: 'templates' | 'export' | 'ats' | 'ai' | 'create';
}

export const DEMO_COMMANDS: DemoCommand[] = [
  {
    id: 'create-resume',
    label: 'Create new resume',
    description: 'Start from scratch or use a template',
    icon: FileText,
    keywords: ['new', 'start', 'begin', 'create'],
    previewType: 'create',
  },
  {
    id: 'templates',
    label: 'Browse templates',
    description: '700+ ATS-optimized designs',
    icon: Layout,
    keywords: ['design', 'theme', 'style', 'template'],
    previewType: 'templates',
  },
  {
    id: 'export-pdf',
    label: 'Export to PDF',
    description: 'Download in multiple formats',
    icon: Download,
    keywords: ['download', 'save', 'print', 'pdf', 'docx'],
    previewType: 'export',
  },
  {
    id: 'ats-check',
    label: 'ATS compatibility check',
    description: 'Scan and optimize for recruiters',
    icon: CheckCircle,
    keywords: ['scan', 'validate', 'optimize', 'ats', 'recruiter'],
    previewType: 'ats',
  },
  {
    id: 'ai-improve',
    label: 'AI-powered improvements',
    description: 'Get smart suggestions instantly',
    icon: Sparkles,
    keywords: ['enhance', 'suggest', 'ai', 'improve', 'magic'],
    previewType: 'ai',
  },
];

export const SPARK_MESSAGES = [
  { text: 'See it in action', icon: Wand2 },
  { text: 'Try the magic', icon: Sparkles },
  { text: 'Build in 8 minutes', icon: FileText },
  { text: 'No signup needed', icon: CheckCircle },
];

export const DEMO_HINT_TEXT = 'Type "resume" or "export" to explore...';
