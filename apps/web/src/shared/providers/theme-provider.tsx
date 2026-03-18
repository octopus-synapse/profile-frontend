'use client';

/**
 * Theme Provider
 * Manages light/dark mode with system preference detection
 * and localStorage persistence
 *
 * Note: The themeScript in layout.tsx applies the correct theme class
 * BEFORE React hydrates, preventing any flash of wrong theme.
 * This provider syncs React state with the already-applied theme.
 */

import { safeLocalStorage } from '@profile/api-client';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'profile-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function getInitialTheme(): Theme {
  const stored = safeLocalStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function getInitialResolvedTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  // Read from DOM - themeScript already applied the correct class
  if (document.documentElement.classList.contains('light')) return 'light';
  return 'dark';
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  // Initialize with values that match what themeScript already applied
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Sync React state with already-applied theme on mount
  useEffect(() => {
    queueMicrotask(() => {
      setThemeState(getInitialTheme());
      setResolvedTheme(getInitialResolvedTheme());
      setMounted(true);
    });
  }, []);

  // Update resolved theme and apply to document when theme changes
  useEffect(() => {
    if (!mounted) return;

    const resolved = theme === 'system' ? getSystemTheme() : theme;
    queueMicrotask(() => setResolvedTheme(resolved));

    // Apply theme to document
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    // Update color-scheme for native elements
    root.style.colorScheme = resolved;
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const newResolved = getSystemTheme();
      setResolvedTheme(newResolved);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted, theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    safeLocalStorage.setItem(THEME_KEY, newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  // Always render Provider - themeScript prevents flash, no need for visibility hidden
  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Optional hook that returns null if used outside provider
export function useThemeOptional() {
  return useContext(ThemeContext);
}

// Script to inject into head to prevent flash
// Dark theme is the default
export const themeScript = `
  (function() {
    const THEME_KEY = 'profile-theme';
    const stored = localStorage.getItem(THEME_KEY);
    let theme = 'dark';
    
    if (stored === 'light') {
      theme = 'light';
    } else if (stored === 'system') {
      theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  })();
`;
