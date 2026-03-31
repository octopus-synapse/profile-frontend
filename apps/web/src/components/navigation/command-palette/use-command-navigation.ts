import { useCallback, useEffect, useState } from 'react';
import type { CommandItem } from './types';

interface UseCommandNavigationOptions {
  isOpen: boolean;
  flatItems: CommandItem[];
  onSelect: (item: CommandItem) => void;
  onClose: () => void;
}

interface UseCommandNavigationResult {
  selectedIndex: number;
  resetIndex: () => void;
}

export function useCommandNavigation({
  isOpen,
  flatItems,
  onSelect,
  onClose,
}: UseCommandNavigationOptions): UseCommandNavigationResult {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const resetIndex = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => (i < flatItems.length - 1 ? i + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => (i > 0 ? i - 1 : flatItems.length - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (flatItems[selectedIndex]) {
            onSelect(flatItems[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onSelect, onClose]);

  // Reset index when items change
  useEffect(() => {
    if (selectedIndex >= flatItems.length) {
      setSelectedIndex(Math.max(0, flatItems.length - 1));
    }
  }, [flatItems.length, selectedIndex]);

  return {
    selectedIndex,
    resetIndex,
  };
}
