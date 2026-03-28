'use client';

import { FileText } from 'lucide-react';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Suspense } from 'react';

interface SectionIconProps {
  iconType: string;
  icon: string;
  className?: string;
  size?: number;
}

function EmojiIcon({ icon, className, size = 18 }: Omit<SectionIconProps, 'iconType'>) {
  return (
    <span className={className} style={{ fontSize: size }}>
      {icon}
    </span>
  );
}

export function SectionIcon({ iconType, icon, className, size = 18 }: SectionIconProps) {
  if (iconType === 'emoji') {
    return <EmojiIcon icon={icon} className={className} size={size} />;
  }

  if (iconType === 'lucide') {
    return (
      <Suspense fallback={<FileText className={className} size={size} strokeWidth={1.5} />}>
        <DynamicIcon
          name={icon as never}
          className={className}
          size={size}
          strokeWidth={1.5}
          fallback={() => <FileText className={className} size={size} strokeWidth={1.5} />}
        />
      </Suspense>
    );
  }

  return <EmojiIcon icon="📄" className={className} size={size} />;
}
