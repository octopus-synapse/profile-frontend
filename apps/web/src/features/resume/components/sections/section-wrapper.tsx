/**
 * Section Wrapper Component
 * Applies section-level styling
 */

"use client";

import { useStyleConfig } from "../context/style-context";
import { cn } from "@/shared/utils";

interface Props {
  id: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Section({ id, title, children, className }: Props) {
  const { classes, colors } = useStyleConfig();

  return (
    <section id={id} className={cn(classes.sectionGap, className)}>
      {title && (
        <h2
          className={cn("mb-3", classes.headingText, classes.headingStyle)}
          style={{
            borderColor: colors.primary,
            color: colors.text.primary,
          }}
        >
          {title}
        </h2>
      )}
      <div className={classes.itemGap}>{children}</div>
    </section>
  );
}
