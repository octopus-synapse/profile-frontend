/**
 * Sample job listings for the Pipeline animation section.
 */
export interface PipelineJob {
  company: string;
  role: string;
  score: number;
  detail: string;
}

export const PIPELINE_JOBS: PipelineJob[] = [
  { company: 'Stripe', role: 'Staff Engineer', score: 98, detail: 'Matching Stack (A+B)' },
  { company: 'Nubank', role: 'Product Lead', score: 92, detail: 'Keywords Patched' },
  { company: 'Google', role: 'Senior Frontend', score: 95, detail: 'React + TS Optimized' },
  { company: 'AWS', role: 'Cloud Architect', score: 91, detail: 'Infra Stack Matched' },
  { company: 'Netflix', role: 'UI Engineer', score: 94, detail: 'Design System Focus' },
  { company: 'Spotify', role: 'Mobile Lead', score: 89, detail: 'React Native Patched' },
  { company: 'Microsoft', role: 'DevOps Engineer', score: 93, detail: 'Azure Stack' },
  { company: 'Uber', role: 'Backend Lead', score: 90, detail: 'Go + Kafka' },
  { company: 'Airbnb', role: 'Product Designer', score: 88, detail: 'Design + Code' },
  { company: 'Meta', role: 'Engineering Manager', score: 96, detail: 'Leadership Track' },
  { company: 'Apple', role: 'iOS Engineer', score: 92, detail: 'SwiftUI Focus' },
  { company: 'Twitter', role: 'Data Engineer', score: 87, detail: 'Spark + Python' },
];

export const PIPELINE_BATCH_SIZE = 3;
