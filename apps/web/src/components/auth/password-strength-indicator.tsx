/**
 * PasswordStrengthIndicator — visual indicator for password strength.
 */

'use client';

import { useT } from '@profile/i18n';

type StrengthKey =
  | 'auth.signUp.passwordStrength.weak'
  | 'auth.signUp.passwordStrength.fair'
  | 'auth.signUp.passwordStrength.good'
  | 'auth.signUp.passwordStrength.strong';

interface StrengthConfig {
  labelKey: StrengthKey;
  barColor: string;
  textColor: string;
}

const STRENGTH_LEVELS: Record<'WEAK' | 'FAIR' | 'GOOD' | 'STRONG', StrengthConfig> = {
  WEAK: {
    labelKey: 'auth.signUp.passwordStrength.weak',
    barColor: 'bg-red-500',
    textColor: 'text-red-400',
  },
  FAIR: {
    labelKey: 'auth.signUp.passwordStrength.fair',
    barColor: 'bg-amber-500',
    textColor: 'text-amber-400',
  },
  GOOD: {
    labelKey: 'auth.signUp.passwordStrength.good',
    barColor: 'bg-cyan-500',
    textColor: 'text-cyan-400',
  },
  STRONG: {
    labelKey: 'auth.signUp.passwordStrength.strong',
    barColor: 'bg-emerald-500',
    textColor: 'text-emerald-400',
  },
};

function calculateStrength(password: string): { score: number; config: StrengthConfig } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, config: STRENGTH_LEVELS.WEAK };
  if (score <= 2) return { score, config: STRENGTH_LEVELS.FAIR };
  if (score <= 3) return { score, config: STRENGTH_LEVELS.GOOD };
  return { score, config: STRENGTH_LEVELS.STRONG };
}

interface Props {
  password: string;
}

export function PasswordStrengthIndicator({ password }: Props) {
  const t = useT();
  if (!password) return null;

  const { score, config } = calculateStrength(password);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${level <= score ? config.barColor : 'bg-white/10'}`}
          />
        ))}
      </div>
      <p className={`ml-1 font-mono text-[10px] ${config.textColor}`}>{t(config.labelKey)}</p>
    </div>
  );
}

export { calculateStrength };
