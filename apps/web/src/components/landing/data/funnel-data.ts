export interface FunnelStage {
  label: string;
  value: number;
  pct: string | null;
  fill: string;
  text: string;
  sub: string;
}

export const FUNNEL_STAGES: FunnelStage[] = [
  {
    label: 'Currículos enviados',
    value: 1000,
    pct: null,
    fill: '#e4e4e7',
    text: '#3f3f46',
    sub: '#71717a',
  },
  {
    label: 'Passam pelo ATS',
    value: 170,
    pct: '17%',
    fill: '#fecaca',
    text: '#991b1b',
    sub: '#dc2626',
  },
  {
    label: 'Lidos por humanos',
    value: 34,
    pct: '3.4%',
    fill: '#fed7aa',
    text: '#9a3412',
    sub: '#ea580c',
  },
  {
    label: 'Chamados para entrevista',
    value: 6,
    pct: '0.6%',
    fill: '#06b6d4',
    text: '#ffffff',
    sub: '#e0f9fd',
  },
];
