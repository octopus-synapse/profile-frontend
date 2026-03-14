/**
 * Demo Mock Data
 *
 * Static data for interactive demo steps.
 * Separated from types for maintainability.
 */

// Mock data for resume builder
export const MOCK_RESUME_DATA = {
  name: '',
  title: 'Senior Frontend Developer',
  summary:
    'Passionate developer with 5+ years building scalable web applications. Expert in React, TypeScript, and modern frontend architecture.',
  experience: [
    {
      company: 'TechCorp',
      role: 'Senior Frontend Developer',
      period: '2021 - Present',
      highlights: [
        'Led migration to React 18 with 40% performance improvement',
        'Architected design system used by 50+ developers',
      ],
    },
    {
      company: 'StartupXYZ',
      role: 'Frontend Developer',
      period: '2019 - 2021',
      highlights: [
        'Built real-time dashboard serving 100K+ daily users',
        'Reduced bundle size by 60% through code splitting',
      ],
    },
  ],
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'GraphQL',
    'TailwindCSS',
  ],
  education: {
    degree: 'B.S. Computer Science',
    school: 'University of São Paulo',
    year: '2019',
  },
  github: {
    username: 'devpro',
    stars: 1247,
    repos: 42,
    contributions: 2341,
  },
};

// Mock templates - professional color palette
export const MOCK_TEMPLATES = [
  { id: 'executive', name: 'Executive', color: '#1a1a2e', popular: true },
  { id: 'modern', name: 'Modern', color: '#0f172a', popular: true },
  { id: 'minimal', name: 'Minimal', color: '#fafafa', popular: true },
  { id: 'professional', name: 'Professional', color: '#1e293b', popular: false },
  { id: 'classic', name: 'Classic', color: '#f8fafc', popular: false },
  { id: 'nordic', name: 'Nordic', color: '#0c0a09', popular: false },
];

// ATS Keywords analysis
export const MOCK_ATS_KEYWORDS = [
  { keyword: 'React', found: true, impact: '+12%' },
  { keyword: 'TypeScript', found: true, impact: '+10%' },
  { keyword: 'Node.js', found: true, impact: '+8%' },
  { keyword: 'Team Leadership', found: true, impact: '+6%' },
  { keyword: 'CI/CD', found: false, suggestion: 'Add for +5%' },
  { keyword: 'Agile', found: false, suggestion: 'Add for +4%' },
];

// Color themes for templates - professional palette
export const TEMPLATE_COLORS = [
  { id: 'slate', name: 'Slate', hex: '#475569' },
  { id: 'zinc', name: 'Zinc', hex: '#71717a' },
  { id: 'stone', name: 'Stone', hex: '#78716c' },
  { id: 'neutral', name: 'Neutral', hex: '#737373' },
  { id: 'charcoal', name: 'Charcoal', hex: '#27272a' },
];

// AI Suggestions for tailored CV
export const MOCK_AI_SUGGESTIONS = [
  {
    id: '1',
    type: 'add',
    original: '',
    suggested: 'Led cross-functional team of 8 engineers',
    impact: '+8%',
    category: 'Leadership',
  },
  {
    id: '2',
    type: 'improve',
    original: 'Worked on frontend projects',
    suggested: 'Architected frontend systems serving 2M+ daily users',
    impact: '+12%',
    category: 'Impact',
  },
  {
    id: '3',
    type: 'add',
    original: '',
    suggested: 'Reduced deployment time by 60% through CI/CD automation',
    impact: '+6%',
    category: 'DevOps',
  },
  {
    id: '4',
    type: 'improve',
    original: 'Good communication skills',
    suggested: 'Presented technical proposals to C-level stakeholders',
    impact: '+5%',
    category: 'Communication',
  },
];

// Tailored versions for different companies
export const MOCK_TAILORED_VERSIONS = [
  { company: 'Nubank', focus: 'Fintech & Scale', matchBoost: '+12%' },
  { company: 'iFood', focus: 'Real-time Systems', matchBoost: '+9%' },
  { company: 'PicPay', focus: 'Mobile & Payments', matchBoost: '+11%' },
];
