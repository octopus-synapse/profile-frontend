/**
 * Summary Section Component
 */

"use client";

import { Section } from "./section-wrapper";
import { useStyleConfig } from "../context/style-context";

interface Props {
  summary: string | null;
}

export function SummarySection({ summary }: Props) {
  const { colors, classes } = useStyleConfig();

  if (!summary) return null;

  return (
    <Section id="summary" title="Professional Summary">
      <p
        className={`${classes.bodyText} leading-relaxed whitespace-pre-wrap break-words`}
        style={{ color: colors.text.secondary }}
      >
        {summary}
      </p>
    </Section>
  );
}
