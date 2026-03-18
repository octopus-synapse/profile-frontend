export type Tone = 'critical' | 'warning' | 'attention' | 'ready';

export interface DemoIssue {
  title: string;
  detail: string;
  tone: Tone;
}

export interface DemoScene {
  id: string;
  revision: string;
  resumeState: string;
  resumeHeadline: string;
  resumeSummary: string;
  resumeBullet1: string;
  resumeBullet2: string;
  eyebrow: string;
  title: string;
  description: string;
  status: string;
  job: string;
  score: string;
  keywords: string;
  blockers: string;
  readiness: string;
  progress: string;
  tone: Tone;
  issues: DemoIssue[];
  actionTitle: string;
  actionDescription: string;
}

type TranslationFn = (key: string, params?: Record<string, string>) => string;

export const SCENE_INTERVAL_MS = 4200;

export const toneStyles: Record<
  Tone,
  {
    pill: string;
    score: string;
    progress: string;
    panel: string;
  }
> = {
  critical: {
    pill: 'border-rose-400/20 bg-rose-500/10 text-rose-200',
    score: 'text-rose-300',
    progress: 'from-rose-300 via-orange-300 to-amber-200',
    panel: 'from-rose-500/12 via-white/[0.04] to-transparent',
  },
  warning: {
    pill: 'border-orange-400/20 bg-orange-500/10 text-orange-200',
    score: 'text-orange-200',
    progress: 'from-orange-200 via-amber-200 to-yellow-100',
    panel: 'from-orange-500/12 via-white/[0.04] to-transparent',
  },
  attention: {
    pill: 'border-amber-400/20 bg-amber-500/10 text-amber-100',
    score: 'text-amber-100',
    progress: 'from-amber-200 via-yellow-100 to-lime-100',
    panel: 'from-amber-500/12 via-white/[0.04] to-transparent',
  },
  ready: {
    pill: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
    score: 'text-emerald-200',
    progress: 'from-emerald-200 via-sky-200 to-violet-200',
    panel: 'from-emerald-500/12 via-white/[0.04] to-transparent',
  },
};

export const issueStyles: Record<
  Tone,
  {
    icon: string;
    card: string;
  }
> = {
  critical: {
    icon: 'text-rose-300',
    card: 'border-rose-400/12 bg-rose-500/8',
  },
  warning: {
    icon: 'text-orange-200',
    card: 'border-orange-400/12 bg-orange-500/8',
  },
  attention: {
    icon: 'text-amber-100',
    card: 'border-amber-400/12 bg-amber-500/8',
  },
  ready: {
    icon: 'text-emerald-200',
    card: 'border-emerald-400/12 bg-emerald-500/8',
  },
};

export function createDemoScenes(t: TranslationFn): DemoScene[] {
  return [
    {
      id: 'critical',
      revision: '01/04',
      resumeState: t('landing.demo.scene1.resumeState'),
      resumeHeadline: t('landing.demo.scene1.resumeHeadline'),
      resumeSummary: t('landing.demo.scene1.resumeSummary'),
      resumeBullet1: t('landing.demo.scene1.resumeBullet1'),
      resumeBullet2: t('landing.demo.scene1.resumeBullet2'),
      eyebrow: t('landing.demo.scene1.eyebrow'),
      title: t('landing.demo.scene1.title'),
      description: t('landing.demo.scene1.description'),
      status: t('landing.demo.scene1.status'),
      job: t('landing.demo.scene1.job'),
      score: '41',
      keywords: '4/14',
      blockers: '3',
      readiness: '18%',
      progress: '41%',
      tone: 'critical',
      issues: [
        {
          title: t('landing.demo.scene1.issue1.title'),
          detail: t('landing.demo.scene1.issue1.detail'),
          tone: 'critical',
        },
        {
          title: t('landing.demo.scene1.issue2.title'),
          detail: t('landing.demo.scene1.issue2.detail'),
          tone: 'critical',
        },
        {
          title: t('landing.demo.scene1.issue3.title'),
          detail: t('landing.demo.scene1.issue3.detail'),
          tone: 'warning',
        },
      ],
      actionTitle: t('landing.demo.scene1.actionTitle'),
      actionDescription: t('landing.demo.scene1.actionDescription'),
    },
    {
      id: 'warning',
      revision: '02/04',
      resumeState: t('landing.demo.scene2.resumeState'),
      resumeHeadline: t('landing.demo.scene2.resumeHeadline'),
      resumeSummary: t('landing.demo.scene2.resumeSummary'),
      resumeBullet1: t('landing.demo.scene2.resumeBullet1'),
      resumeBullet2: t('landing.demo.scene2.resumeBullet2'),
      eyebrow: t('landing.demo.scene2.eyebrow'),
      title: t('landing.demo.scene2.title'),
      description: t('landing.demo.scene2.description'),
      status: t('landing.demo.scene2.status'),
      job: t('landing.demo.scene2.job'),
      score: '63',
      keywords: '8/14',
      blockers: '2',
      readiness: '47%',
      progress: '63%',
      tone: 'warning',
      issues: [
        {
          title: t('landing.demo.scene2.issue1.title'),
          detail: t('landing.demo.scene2.issue1.detail'),
          tone: 'ready',
        },
        {
          title: t('landing.demo.scene2.issue2.title'),
          detail: t('landing.demo.scene2.issue2.detail'),
          tone: 'warning',
        },
        {
          title: t('landing.demo.scene2.issue3.title'),
          detail: t('landing.demo.scene2.issue3.detail'),
          tone: 'warning',
        },
      ],
      actionTitle: t('landing.demo.scene2.actionTitle'),
      actionDescription: t('landing.demo.scene2.actionDescription'),
    },
    {
      id: 'attention',
      revision: '03/04',
      resumeState: t('landing.demo.scene3.resumeState'),
      resumeHeadline: t('landing.demo.scene3.resumeHeadline'),
      resumeSummary: t('landing.demo.scene3.resumeSummary'),
      resumeBullet1: t('landing.demo.scene3.resumeBullet1'),
      resumeBullet2: t('landing.demo.scene3.resumeBullet2'),
      eyebrow: t('landing.demo.scene3.eyebrow'),
      title: t('landing.demo.scene3.title'),
      description: t('landing.demo.scene3.description'),
      status: t('landing.demo.scene3.status'),
      job: t('landing.demo.scene3.job'),
      score: '81',
      keywords: '11/14',
      blockers: '1',
      readiness: '78%',
      progress: '81%',
      tone: 'attention',
      issues: [
        {
          title: t('landing.demo.scene3.issue1.title'),
          detail: t('landing.demo.scene3.issue1.detail'),
          tone: 'ready',
        },
        {
          title: t('landing.demo.scene3.issue2.title'),
          detail: t('landing.demo.scene3.issue2.detail'),
          tone: 'attention',
        },
        {
          title: t('landing.demo.scene3.issue3.title'),
          detail: t('landing.demo.scene3.issue3.detail'),
          tone: 'warning',
        },
      ],
      actionTitle: t('landing.demo.scene3.actionTitle'),
      actionDescription: t('landing.demo.scene3.actionDescription'),
    },
    {
      id: 'ready',
      revision: '04/04',
      resumeState: t('landing.demo.scene4.resumeState'),
      resumeHeadline: t('landing.demo.scene4.resumeHeadline'),
      resumeSummary: t('landing.demo.scene4.resumeSummary'),
      resumeBullet1: t('landing.demo.scene4.resumeBullet1'),
      resumeBullet2: t('landing.demo.scene4.resumeBullet2'),
      eyebrow: t('landing.demo.scene4.eyebrow'),
      title: t('landing.demo.scene4.title'),
      description: t('landing.demo.scene4.description'),
      status: t('landing.demo.scene4.status'),
      job: t('landing.demo.scene4.job'),
      score: '94',
      keywords: '14/14',
      blockers: '0',
      readiness: '96%',
      progress: '94%',
      tone: 'ready',
      issues: [
        {
          title: t('landing.demo.scene4.issue1.title'),
          detail: t('landing.demo.scene4.issue1.detail'),
          tone: 'ready',
        },
        {
          title: t('landing.demo.scene4.issue2.title'),
          detail: t('landing.demo.scene4.issue2.detail'),
          tone: 'ready',
        },
        {
          title: t('landing.demo.scene4.issue3.title'),
          detail: t('landing.demo.scene4.issue3.detail'),
          tone: 'ready',
        },
      ],
      actionTitle: t('landing.demo.scene4.actionTitle'),
      actionDescription: t('landing.demo.scene4.actionDescription'),
    },
  ];
}
