'use client';

import { Button } from '@octopus-synapse/profile-ui';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface SectionVisibilityToggleProps {
  resumeId: string;
  sectionId: string;
  visible: boolean;
  label: string;
  onToggle: (sectionId: string, visible: boolean) => Promise<void>;
}

export function SectionVisibilityToggle({
  sectionId,
  visible,
  label,
  onToggle,
}: SectionVisibilityToggleProps) {
  const [isPending, setIsPending] = useState(false);
  const [optimisticVisible, setOptimisticVisible] = useState(visible);

  const handleToggle = async () => {
    const newValue = !optimisticVisible;
    setOptimisticVisible(newValue);
    setIsPending(true);
    try {
      await onToggle(sectionId, newValue);
    } catch {
      setOptimisticVisible(!newValue);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      tone="neutral"
      size="sm"
      loading={isPending}
      disabled={isPending}
      aria-label={`${optimisticVisible ? 'Hide' : 'Show'} ${label}`}
      leftIcon={optimisticVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      onPress={() => void handleToggle()}
    >
      <span className={optimisticVisible ? '' : 'line-through opacity-50'}>{label}</span>
    </Button>
  );
}
