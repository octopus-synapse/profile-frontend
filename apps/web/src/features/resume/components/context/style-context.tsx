/**
 * Style Config Context
 * Provides resolved style configuration to all resume components
 */

"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { ResumeStyleConfig } from "../../types/config";
import { MODERN_CONFIG } from "../../types/presets";

interface StyleContextValue {
  config: ResumeStyleConfig;
  classes: {
    sectionGap: string;
    itemGap: string;
    padding: string;
    borderRadius: string;
    shadow: string;
    headingStyle: string;
    bodyText: string;
    headingText: string;
  };
  colors: ResumeStyleConfig["tokens"]["colors"]["colors"];
}

const StyleContext = createContext<StyleContextValue | null>(null);

export function useStyleConfig() {
  const context = useContext(StyleContext);
  if (!context) throw new Error("useStyleConfig must be used within StyleProvider");
  return context;
}

interface Props {
  config?: Partial<ResumeStyleConfig>;
  children: ReactNode;
}

export function StyleProvider({ config: customConfig, children }: Props) {
  const value = useMemo(() => {
    const config = { ...MODERN_CONFIG, ...customConfig } as ResumeStyleConfig;
    const { tokens } = config;

    const sectionGapMap: Record<string, string> = {
      sm: "mb-4",
      md: "mb-6",
      lg: "mb-8",
      xl: "mb-12",
    };
    const itemGapMap: Record<string, string> = {
      sm: "space-y-2",
      md: "space-y-3",
      lg: "space-y-4",
    };
    const paddingMap: Record<string, string> = { sm: "p-4", md: "p-6", lg: "p-8" };
    const radiusMap: Record<string, string> = {
      none: "",
      sm: "rounded",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    };
    const shadowMap: Record<string, string> = {
      none: "",
      subtle: "shadow-sm",
      medium: "shadow-md",
      strong: "shadow-lg",
    };
    const headingMap: Record<string, string> = {
      bold: "font-bold",
      underline: "border-b-2 pb-1",
      uppercase: "uppercase tracking-wider font-semibold text-sm",
      "accent-border": "border-l-4 pl-3 font-bold",
    };
    const bodyMap: Record<string, string> = { sm: "text-sm", base: "text-base", lg: "text-lg" };
    const headingTextMap: Record<string, string> = {
      sm: "text-lg",
      base: "text-xl",
      lg: "text-2xl",
    };

    return {
      config,
      colors: tokens.colors.colors,
      classes: {
        sectionGap: sectionGapMap[tokens.spacing.sectionGap] ?? "mb-6",
        itemGap: itemGapMap[tokens.spacing.itemGap] ?? "space-y-3",
        padding: paddingMap[tokens.spacing.contentPadding] ?? "p-6",
        borderRadius: radiusMap[tokens.colors.borderRadius] ?? "",
        shadow: shadowMap[tokens.colors.shadows] ?? "",
        headingStyle: headingMap[tokens.typography.headingStyle] ?? "font-bold",
        bodyText: bodyMap[tokens.typography.fontSize] ?? "text-base",
        headingText: headingTextMap[tokens.typography.fontSize] ?? "text-xl",
      },
    };
  }, [customConfig]);

  return <StyleContext.Provider value={value}>{children}</StyleContext.Provider>;
}
