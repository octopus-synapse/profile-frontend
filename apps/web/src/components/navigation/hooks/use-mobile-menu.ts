'use client';

/**
 * useMobileMenu Hook
 * Manages mobile menu state with body scroll lock
 */

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { MobileMenuState } from '../config/types';

// Track pathname changes externally to avoid setState in effect
const pathnameListeners: Set<() => void> = new Set();
let lastPathname: string | null = null;

function subscribeToPathname(callback: () => void) {
  pathnameListeners.add(callback);
  return () => pathnameListeners.delete(callback);
}

function getPathnameSnapshot() {
  return lastPathname;
}

export function useMobileMenu(): MobileMenuState {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  // Use useSyncExternalStore pattern to track changes
  useSyncExternalStore(subscribeToPathname, getPathnameSnapshot, getPathnameSnapshot);

  // Track pathname changes and close menu
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      lastPathname = pathname;
      // Notify all listeners
      for (const listener of pathnameListeners) {
        listener();
      }
      // Schedule close outside of render
      if (isOpen) {
        queueMicrotask(() => setIsOpen(false));
      }
    }
  }, [pathname, isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  return {
    isOpen,
    open,
    toggle,
    close,
  };
}
