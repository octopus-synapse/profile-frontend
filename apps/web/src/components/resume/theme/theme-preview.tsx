/**
 * Theme Preview Component
 * Shows a mini preview of theme styling
 */

'use client';

import type { ResumeStyleConfig, ThemePreset } from '../types/config';
import { modernPreset } from '../types/presets';

interface Props {
  config?: ResumeStyleConfig | ThemePreset;
  className?: string;
}

export function ThemePreview({ config, className = '' }: Props) {
  // Extract styleConfig from preset or use config directly
  const style: ResumeStyleConfig = (() => {
    if (!config) return modernPreset.styleConfig;
    if ('styleConfig' in config && typeof (config as ThemePreset).styleConfig === 'object') {
      return (config as ThemePreset).styleConfig;
    }
    return config as ResumeStyleConfig;
  })();

  const tokens = style.tokens;
  const layout = style as { layout?: { type?: string } };

  // Extract colors for preview
  const colorPalette = tokens?.colors ?? style.colors;
  const primaryRaw = colorPalette?.primary;
  const primaryColor = typeof primaryRaw === 'string' ? primaryRaw : '#2563eb';
  const bgRaw = colorPalette?.background;
  const bgColor = typeof bgRaw === 'string' ? bgRaw : '#ffffff';
  const textRaw = colorPalette?.text;
  const textColor =
    typeof textRaw === 'string'
      ? textRaw
      : ((textRaw as Record<string, string>)?.primary ?? '#1f2937');
  const borderRadius = 'rounded';

  const isCompact = tokens?.spacing === 'compact';
  const isTwoColumn = layout.layout?.type === 'two-column';

  return (
    <div
      className={`aspect-[8.5/11] w-full overflow-hidden ${borderRadius} border shadow-sm ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Mini resume layout */}
      <div className="flex h-full flex-col p-2 text-[4px]" style={{ color: textColor }}>
        {/* Header */}
        <div
          className={`${isCompact ? 'pb-1' : 'pb-2'} mb-1 border-b`}
          style={{ borderColor: `${primaryColor}40` }}
        >
          <div className="mb-0.5 h-2 w-16 rounded-sm" style={{ backgroundColor: textColor }} />
          <div className="h-1 w-12 rounded-sm" style={{ backgroundColor: primaryColor }} />
        </div>

        {/* Content */}
        {isTwoColumn ? (
          <TwoColumnPreview primaryColor={primaryColor} textColor={textColor} />
        ) : (
          <SingleColumnPreview primaryColor={primaryColor} textColor={textColor} />
        )}
      </div>
    </div>
  );
}

function SingleColumnPreview({
  primaryColor,
  textColor,
}: {
  primaryColor: string;
  textColor: string;
}) {
  return (
    <div className="flex-1 space-y-1.5">
      {/* Summary */}
      <PreviewSection primaryColor={primaryColor}>
        <div className="space-y-0.5">
          <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: `${textColor}60` }} />
          <div className="h-0.5 w-4/5 rounded-sm" style={{ backgroundColor: `${textColor}60` }} />
        </div>
      </PreviewSection>

      {/* Experience */}
      <PreviewSection primaryColor={primaryColor}>
        <div className="space-y-1">
          <PreviewItem textColor={textColor} />
          <PreviewItem textColor={textColor} />
        </div>
      </PreviewSection>

      {/* Skills */}
      <PreviewSection primaryColor={primaryColor}>
        <div className="flex flex-wrap gap-0.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-1 w-4 rounded-sm"
              style={{ backgroundColor: `${primaryColor}30` }}
            />
          ))}
        </div>
      </PreviewSection>
    </div>
  );
}

function TwoColumnPreview({
  primaryColor,
  textColor,
}: {
  primaryColor: string;
  textColor: string;
}) {
  return (
    <div className="flex flex-1 gap-1">
      {/* Main column */}
      <div className="flex-1 space-y-1.5">
        <PreviewSection primaryColor={primaryColor}>
          <PreviewItem textColor={textColor} />
        </PreviewSection>
        <PreviewSection primaryColor={primaryColor}>
          <PreviewItem textColor={textColor} />
        </PreviewSection>
      </div>

      {/* Sidebar */}
      <div className="w-10 space-y-1.5 border-l pl-1" style={{ borderColor: `${textColor}20` }}>
        <PreviewSection primaryColor={primaryColor}>
          <div className="space-y-0.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-0.5 w-full rounded-sm"
                style={{ backgroundColor: `${primaryColor}30` }}
              />
            ))}
          </div>
        </PreviewSection>
        <PreviewSection primaryColor={primaryColor}>
          <div className="space-y-0.5">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-0.5 w-3/4 rounded-sm"
                style={{ backgroundColor: `${textColor}40` }}
              />
            ))}
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

function PreviewSection({
  primaryColor,
  children,
}: {
  primaryColor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-0.5 h-0.5 w-8 rounded-sm" style={{ backgroundColor: primaryColor }} />
      {children}
    </div>
  );
}

function PreviewItem({ textColor }: { textColor: string }) {
  return (
    <div className="space-y-0.5">
      <div className="h-0.5 w-10 rounded-sm" style={{ backgroundColor: textColor }} />
      <div className="h-0.5 w-full rounded-sm" style={{ backgroundColor: `${textColor}40` }} />
      <div className="h-0.5 w-3/4 rounded-sm" style={{ backgroundColor: `${textColor}40` }} />
    </div>
  );
}
