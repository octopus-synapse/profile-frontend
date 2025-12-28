"use client";

/**
 * useMobileMenu Hook
 * Manages mobile menu state with body scroll lock
 */

import { useState, useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import type { MobileMenuState } from "../types";

// Track pathname changes externally to avoid setState in effect
let pathnameListeners: Set<() => void> = new Set();
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

  // Track pathname changes and close menu - using ref to avoid effect setState
  if (previousPathnameRef.current !== pathname) {
    previousPathnameRef.current = pathname;
    lastPathname = pathname;
    // Schedule close outside of render
    if (isOpen) {
      queueMicrotask(() => setIsOpen(false));
    }
  }

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    toggle,
    close,
  };
}
