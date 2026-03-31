'use client';

import { useI18n } from '@profile/i18n';
import { useJobCycle } from '../hooks';
import { JobPostCard, ProfileCard, ResumePreviewCard } from './foco';

export function FocoSection() {
  const { t } = useI18n();
  const currentJob = useJobCycle();

  return (
    <section className="bg-white px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter text-zinc-900 md:text-7xl">
            {t('landing.foco.title')}
            <br />
            <span className="text-cyan-500">{t('landing.foco.titleAccent')}</span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-500">
            {t('landing.foco.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          <ProfileCard t={t} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <JobPostCard currentJob={currentJob} t={t} />
            <ResumePreviewCard currentJob={currentJob} t={t} />
          </div>
        </div>
      </div>
    </section>
  );
}
