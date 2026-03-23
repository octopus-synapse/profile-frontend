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
      <span
        className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-cyan-600/40'}`}
      />
      <span
        className={`font-mono uppercase tracking-widest ${
          isDark ? 'text-white/35' : 'text-cyan-600'
        }`}
        style={{ fontSize: '0.65rem' }}
      >
        {children}
      </span>
      <span
        className={`h-px w-8 ${isDark ? 'bg-white/20' : 'bg-cyan-600/40'}`}
      />
    </div>
  );
}
