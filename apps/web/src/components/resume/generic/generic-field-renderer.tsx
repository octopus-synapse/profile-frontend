/**
 * Generic Field Renderer
 *
 * Renders a single field value based on its type and semantic role.
 * Handles strings, arrays, dates, and nested objects.
 */

'use client';

import type { SectionStylesDto } from '@profile/api-client';

interface GenericFieldRendererProps {
  fieldKey: string;
  value: unknown;
  isHeader?: boolean;
  isDate?: boolean;
  isDescription?: boolean;
  styles: SectionStylesDto;
}

/**
 * Format a date value for display
 */
function formatDate(value: unknown): string {
  if (!value) return '';

  if (typeof value === 'string') {
    // Check if it's an ISO date
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    return value;
  }

  return String(value);
}

/**
 * Humanize a field key for display
 */
function humanizeFieldKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export function GenericFieldRenderer({
  fieldKey,
  value,
  isHeader = false,
  isDate = false,
  isDescription = false,
  styles,
}: GenericFieldRendererProps) {
  // Skip null/undefined values
  if (value === null || value === undefined) return null;

  // Skip empty strings
  if (typeof value === 'string' && value.trim() === '') return null;

  // Skip empty arrays
  if (Array.isArray(value) && value.length === 0) return null;

  // Body text styles
  const bodyStyle = {
    fontFamily: styles.content?.fontFamily,
    fontSize: `${styles.content?.fontSizePx ?? 14}px`,
    lineHeight: styles.content?.lineHeight ?? 1.5,
  };

  // Header style (bold, larger)
  if (isHeader) {
    const headerStyle = {
      ...bodyStyle,
      fontWeight: 600,
      fontSize: `${(styles.content?.fontSizePx ?? 14) + 2}px`,
    };

    return (
      <div style={headerStyle}>{typeof value === 'string' ? value : JSON.stringify(value)}</div>
    );
  }

  // Date style (muted, smaller)
  if (isDate) {
    return (
      <span
        style={{
          ...bodyStyle,
          color: '#666',
          fontSize: `${(styles.content?.fontSizePx ?? 14) - 1}px`,
        }}
      >
        {formatDate(value)}
      </span>
    );
  }

  // Description style (normal body text)
  if (isDescription) {
    // Handle arrays (like achievements)
    if (Array.isArray(value)) {
      return (
        <ul
          style={{
            ...bodyStyle,
            margin: '8px 0',
            paddingLeft: '20px',
          }}
        >
          {value.map((item, index) => (
            <li key={index} style={{ marginBottom: '4px' }}>
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p style={{ ...bodyStyle, margin: '8px 0' }}>
        {typeof value === 'string' ? value : JSON.stringify(value)}
      </p>
    );
  }

  // Default: show label and value
  // Handle arrays
  if (Array.isArray(value)) {
    return (
      <div style={{ ...bodyStyle, marginBottom: '4px' }}>
        <span style={{ fontWeight: 500, marginRight: '4px' }}>{humanizeFieldKey(fieldKey)}:</span>
        {value.join(', ')}
      </div>
    );
  }

  // Handle objects
  if (typeof value === 'object') {
    return (
      <div style={{ ...bodyStyle, marginBottom: '4px' }}>
        <span style={{ fontWeight: 500, marginRight: '4px' }}>{humanizeFieldKey(fieldKey)}:</span>
        <span style={{ color: '#666' }}>{JSON.stringify(value)}</span>
      </div>
    );
  }

  // Handle primitives
  return (
    <div style={{ ...bodyStyle, marginBottom: '4px' }}>
      <span style={{ fontWeight: 500, marginRight: '4px' }}>{humanizeFieldKey(fieldKey)}:</span>
      {String(value)}
    </div>
  );
}
