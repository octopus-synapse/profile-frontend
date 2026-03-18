export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  highlight?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'AC',
    content:
      'PATCH completely transformed my job search. My resume went from generic to perfectly tailored for each role. Landed 3x more interviews in the first week.',
    rating: 5,
    highlight: '3x more interviews',
  },
  {
    id: '2',
    name: 'Sarah Miller',
    role: 'Full Stack Developer',
    company: 'Stripe',
    avatar: 'SM',
    content:
      'The ATS optimization is incredible. I was getting filtered out by automated systems before. Now my applications actually reach recruiters.',
    rating: 5,
    highlight: 'ATS bypass success',
  },
  {
    id: '3',
    name: 'Marcus Johnson',
    role: 'DevOps Engineer',
    company: 'Netflix',
    avatar: 'MJ',
    content:
      'Built my resume in 10 minutes. The AI suggestions for my skills section were spot-on. Got an offer from my dream company within a month.',
    rating: 5,
    highlight: 'Dream job in 1 month',
  },
  {
    id: '4',
    name: 'Emily Zhang',
    role: 'Backend Engineer',
    company: 'Meta',
    avatar: 'EZ',
    content:
      'As someone who hates writing about myself, PATCH made it painless. The templates are beautiful and the export quality is professional.',
    rating: 5,
    highlight: 'Painless experience',
  },
  {
    id: '5',
    name: 'David Park',
    role: 'Tech Lead',
    company: 'Microsoft',
    avatar: 'DP',
    content:
      "I recommend PATCH to everyone on my team. It's become our go-to tool for resume updates. The version control feature is genius.",
    rating: 5,
    highlight: 'Team-wide adoption',
  },
];
