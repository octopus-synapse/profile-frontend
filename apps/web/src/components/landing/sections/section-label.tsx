'use client';

interface SectionLabelProps {
  children: React.ReactNode;
  variant: 'dark' | 'light';
  centered?: boolean;
}

export function SectionLabel({ children, variant, centered }: SectionLabelProps) {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}>
      <span className={`h-px w-8 ${isDark ? 'bg-white/30' : 'bg-cyan-600/50'}`} />
      <span
        className={`font-mono text-xs uppercase tracking-widest ${
          isDark ? 'text-white/60' : 'text-cyan-600'
        }`}
      >
        {children}
      </span>
      <span className={`h-px w-8 ${isDark ? 'bg-white/30' : 'bg-cyan-600/50'}`} />
    </div>
  );
}
