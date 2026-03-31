import type { DictionaryKey } from '@profile/i18n';

export interface FocoJob {
  key: DictionaryKey;
  company: string;
  location: string;
}

export const FOCO_JOBS: readonly FocoJob[] = [
  {
    key: 'landing.foco.job.seniorTechLead' as DictionaryKey,
    company: 'TechCorp',
    location: 'Remote',
  },
  {
    key: 'landing.foco.job.staffEngineer' as DictionaryKey,
    company: 'StartupX',
    location: 'São Paulo',
  },
  {
    key: 'landing.foco.job.frontendLead' as DictionaryKey,
    company: 'FinBank',
    location: 'Remote',
  },
  {
    key: 'landing.foco.job.productEngineer' as DictionaryKey,
    company: 'ScaleAI',
    location: 'Hybrid',
  },
] as const;

export const FOCO_SKILL_KEYS: DictionaryKey[] = [
  'landing.foco.skill.react',
  'landing.foco.skill.typescript',
  'landing.foco.skill.nodejs',
  'landing.foco.skill.systemDesign',
  'landing.foco.skill.teamLeadership',
] as const;

export const FOCO_CYCLE_INTERVAL_MS = 4000;
