/**
 * Resume Page
 * Clean, minimal editor for tech professionals
 */

import type { Metadata } from 'next';
import { ResumeBuilder } from '@/components/resume';

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Manage and customize your professional resume',
};

export default function ResumePage() {
  return <ResumeBuilder />;
}
