'use client';

import { useEffect } from 'react';

const EASING = 0.12;
const DELTA_MULTIPLIER = 0.95;

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === 'input' ||
    tagName === 'textarea' ||
    tagName === 'select' ||
    target.isContentEditable
  );
}

export function SmoothScrollController() {
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const usesCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    root.classList.add('landing-scrollbar');

    if (prefersReducedMotion || usesCoarsePointer) {
      root.classList.add('landing-scroll-native');

      return () => {
        root.classList.remove('landing-scrollbar', 'landing-scroll-native');
      };
    }

    root.classList.add('landing-scroll-enhanced');
    body.classList.add('landing-scroll-enhanced');

    let rafId = 0;
    let isAnimating = false;
    let currentScroll = window.scrollY;
    let targetScroll = window.scrollY;

    const setScrollVariable = (value: number) => {
      root.style.setProperty('--landing-scroll', `${value}px`);
    };

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const clampScroll = (value: number) => Math.min(Math.max(value, 0), getMaxScroll());

    const animate = () => {
      currentScroll += (targetScroll - currentScroll) * EASING;

      if (Math.abs(targetScroll - currentScroll) < 0.5) {
        currentScroll = targetScroll;
      }

      setScrollVariable(currentScroll);
      window.scrollTo({ top: currentScroll, behavior: 'auto' });

      if (Math.abs(targetScroll - currentScroll) >= 0.5) {
        rafId = window.requestAnimationFrame(animate);
        return;
      }

      isAnimating = false;
    };

    const startAnimation = () => {
      if (isAnimating) {
        return;
      }

      isAnimating = true;
      rafId = window.requestAnimationFrame(animate);
    };

    const syncScrollPosition = () => {
      if (isAnimating) {
        return;
      }

      currentScroll = window.scrollY;
      targetScroll = window.scrollY;
      setScrollVariable(window.scrollY);
    };

    setScrollVariable(window.scrollY);

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      targetScroll = clampScroll(targetScroll + event.deltaY * DELTA_MULTIPLIER);
      startAnimation();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || isEditableTarget(event.target)) {
        return;
      }

      const step = window.innerHeight * 0.85;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          targetScroll = clampScroll(targetScroll + 120);
          break;
        case 'ArrowUp':
          event.preventDefault();
          targetScroll = clampScroll(targetScroll - 120);
          break;
        case 'PageDown':
        case ' ':
          event.preventDefault();
          targetScroll = clampScroll(targetScroll + step);
          break;
        case 'PageUp':
          event.preventDefault();
          targetScroll = clampScroll(targetScroll - step);
          break;
        case 'Home':
          event.preventDefault();
          targetScroll = 0;
          break;
        case 'End':
          event.preventDefault();
          targetScroll = getMaxScroll();
          break;
        default:
          return;
      }

      startAnimation();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', syncScrollPosition, { passive: true });
    window.addEventListener('resize', syncScrollPosition);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', syncScrollPosition);
      window.removeEventListener('resize', syncScrollPosition);
      root.style.removeProperty('--landing-scroll');
      root.classList.remove(
        'landing-scrollbar',
        'landing-scroll-native',
        'landing-scroll-enhanced',
      );
      body.classList.remove('landing-scroll-enhanced');
    };
  }, []);

  return null;
}
