"use client";

/**
 * useMobileMenu Hook
 * Manages mobile menu state with body scroll lock
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type { MobileMenuState } from "../types";

export function useMobileMenu(): MobileMenuState {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  // Close menu on route change using ref comparison to avoid setState in effect
  useEffect(() => {
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

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
