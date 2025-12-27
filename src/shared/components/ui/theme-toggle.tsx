"use client";

/**
 * Theme Toggle Component
 * Switch between light, dark, and system themes
 */

import { Moon, Sun, Monitor } from "lucide-react";
import { useThemeOptional } from "@/shared/providers/theme-provider";
import { cn } from "@/shared/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const themeContext = useThemeOptional();

  if (!themeContext) return null;

  const { theme, setTheme } = themeContext;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          theme === "light"
            ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
            : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
        )}
        title="Light mode"
      >
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          theme === "dark"
            ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
            : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
        )}
        title="Dark mode"
      >
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
          theme === "system"
            ? "bg-pf-canvas-emphasis text-pf-fg-on-emphasis"
            : "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle"
        )}
        title="System theme"
      >
        <Monitor className="h-4 w-4" strokeWidth={1.5} />
      </button>
      {showLabel && (
        <span className="text-pf-fg-muted ml-2 text-xs font-medium tracking-wider uppercase">
          {theme}
        </span>
      )}
    </div>
  );
}

// Simple toggle button (just light/dark) - Safe to use outside ThemeProvider
export function ThemeToggleSimple({ className }: { className?: string }) {
  const themeContext = useThemeOptional();

  // Return a static button if not within ThemeProvider
  if (!themeContext) {
    return (
      <button
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
          "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle",
          className
        )}
        title="Toggle theme"
      >
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      </button>
    );
  }

  const { toggleTheme, resolvedTheme } = themeContext;

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
        "text-pf-fg-muted hover:text-pf-fg-default hover:bg-pf-canvas-subtle",
        className
      )}
      title={resolvedTheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      {resolvedTheme === "light" ? (
        <Moon className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <Sun className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
}
