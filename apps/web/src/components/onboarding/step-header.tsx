'use client';

interface OnboardingStepHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function OnboardingStepHeader({
  title,
  description,
  eyebrow = 'Profile setup',
}: OnboardingStepHeaderProps) {
  return (
    <div className="space-y-2">
      <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-blue-400">
        {eyebrow}
      </span>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">{description}</p>
      </div>
    </div>
  );
}
