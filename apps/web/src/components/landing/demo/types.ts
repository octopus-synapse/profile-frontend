/**
 * Interactive Demo Types
 *
 * Professional product experience (~3 min journey)
 * Design principles: Nielsen's Heuristics, minimal aesthetics
 */

// Re-export mock data from separate file
export {
  MOCK_AI_SUGGESTIONS,
  MOCK_ATS_KEYWORDS,
  MOCK_RESUME_DATA,
  MOCK_TAILORED_VERSIONS,
  MOCK_TEMPLATES,
  TEMPLATE_COLORS,
} from './mock-data';

export type DemoStepId =
  | 'welcome'
  | 'resume-builder'
  | 'ats-check'
  | 'templates'
  | 'tailored'
  | 'auto-apply'
  | 'tech-profile'
  | 'export'
  | 'dashboard'
  | 'finale';

export interface DemoStep {
  id: DemoStepId;
  title: string;
  subtitle: string;
  duration: number;
}

export const DEMO_STEPS: DemoStep[] = [
  { id: 'welcome', title: 'Welcome', subtitle: 'Your personalized demo', duration: 5 },
  { id: 'resume-builder', title: 'Resume Builder', subtitle: 'AI-powered creation', duration: 12 },
  { id: 'ats-check', title: 'ATS Score', subtitle: 'Instant optimization', duration: 8 },
  { id: 'templates', title: 'Templates', subtitle: 'Professional designs', duration: 8 },
  { id: 'tailored', title: 'AI Tailoring', subtitle: 'Job-specific optimization', duration: 10 },
  { id: 'auto-apply', title: 'Auto-Apply', subtitle: 'One-click applications', duration: 10 },
  { id: 'tech-profile', title: 'Tech Profile', subtitle: 'Developer showcase', duration: 10 },
  { id: 'export', title: 'Export', subtitle: 'Multiple formats', duration: 8 },
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Track progress', duration: 8 },
  { id: 'finale', title: 'Ready', subtitle: 'Start your journey', duration: 5 },
];

export interface AppliedJobState {
  id: string;
  company: string;
  position: string;
}

export interface DemoState {
  currentStepIndex: number;
  userName: string;
  selectedTemplate: string | null;
  selectedColor: string;
  atsScore: number;
  appliedJobs: AppliedJobState[];
  isPlaying: boolean;
  soundEnabled: boolean;
  reducedMotion: boolean;
  selectedTechStack: string[];
  exportFormat: string;
}

export const INITIAL_DEMO_STATE: DemoState = {
  currentStepIndex: 0,
  userName: '',
  selectedTemplate: null,
  selectedColor: 'slate',
  atsScore: 0,
  appliedJobs: [],
  isPlaying: true,
  soundEnabled: false,
  reducedMotion: false,
  selectedTechStack: ['react', 'typescript', 'nodejs'],
  exportFormat: 'pdf',
};

// Job interface for auto-apply
export interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  match: number;
  skills: string[];
}

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    company: 'Nubank',
    position: 'Senior Frontend Engineer',
    location: 'São Paulo, BR',
    salary: '$120k - $180k',
    match: 94,
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: '2',
    company: 'iFood',
    position: 'Staff Engineer',
    location: 'Remote',
    salary: '$140k - $200k',
    match: 91,
    skills: ['React', 'GraphQL', 'AWS'],
  },
  {
    id: '3',
    company: 'PicPay',
    position: 'Frontend Tech Lead',
    location: 'São Paulo, BR',
    salary: '$130k - $190k',
    match: 88,
    skills: ['React', 'TypeScript', 'Docker'],
  },
  {
    id: '4',
    company: 'Mercado Livre',
    position: 'Senior Software Engineer',
    location: 'Remote',
    salary: '$150k - $220k',
    match: 92,
    skills: ['React', 'Node.js', 'PostgreSQL'],
  },
];

// Dashboard stats
export interface DashboardStat {
  label: string;
  value: string | number;
  trend?: string;
}

export const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Applications', value: 142, trend: '+24%' },
  { label: 'Responses', value: 23, trend: '+12%' },
  { label: 'Interviews', value: 8, trend: '+33%' },
  { label: 'Views', value: 512, trend: '+18%' },
];

// Activity feed
export interface Activity {
  id: string;
  action: string;
  timestamp: string;
}

export const MOCK_ACTIVITY: Activity[] = [
  { id: '1', action: 'Applied to Nubank', timestamp: '2h ago' },
  { id: '2', action: 'Resume viewed by iFood', timestamp: '4h ago' },
  { id: '3', action: 'Interview scheduled with PicPay', timestamp: '1d ago' },
  { id: '4', action: 'Applied to Mercado Livre', timestamp: '2d ago' },
  { id: '5', action: 'Resume updated', timestamp: '3d ago' },
];

// GitHub stats
export interface GitHubStat {
  label: string;
  value: string | number;
}

export const MOCK_GITHUB_STATS: GitHubStat[] = [
  { label: 'Repositories', value: 42 },
  { label: 'Stars', value: '1.2K' },
  { label: 'Contributions', value: '2.3K' },
  { label: 'Pull Requests', value: 328 },
];

// Tech stack
export interface TechItem {
  id: string;
  name: string;
  category: string;
}

export const MOCK_TECH_STACK: TechItem[] = [
  { id: 'react', name: 'React', category: 'Frontend' },
  { id: 'typescript', name: 'TypeScript', category: 'Language' },
  { id: 'nodejs', name: 'Node.js', category: 'Backend' },
  { id: 'nextjs', name: 'Next.js', category: 'Framework' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'docker', name: 'Docker', category: 'DevOps' },
  { id: 'aws', name: 'AWS', category: 'Cloud' },
  { id: 'graphql', name: 'GraphQL', category: 'API' },
  { id: 'tailwind', name: 'Tailwind', category: 'CSS' },
  { id: 'prisma', name: 'Prisma', category: 'ORM' },
];

// Certifications
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export const MOCK_CERTIFICATIONS: Certification[] = [
  { id: 'aws-sa', name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023' },
  { id: 'gcp', name: 'Google Cloud Professional', issuer: 'Google', year: '2022' },
  { id: 'k8s', name: 'Certified Kubernetes Admin', issuer: 'CNCF', year: '2023' },
  { id: 'react', name: 'Meta React Developer', issuer: 'Meta', year: '2024' },
];
