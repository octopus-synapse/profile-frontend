/**
 * Generic Field Renderer
 *
 * Renders a single field value based on its type and semantic role.
 * Handles strings, arrays, dates, and nested objects.
 */

'use client';

import type { SectionStylesDto } from '@profile/api-client';
import { useI18n } from '@profile/i18n';

interface GenericFieldRendererProps {
  fieldKey: string;
  value: unknown;
  isHeader?: boolean;
  isDate?: boolean;
  isDescription?: boolean;
  styles: SectionStylesDto;
}

/**
 * Map app locale to a valid date locale string.
 */
function toDateLocale(locale: string): string {
  const map: Record<string, string> = {
    'pt-BR': 'pt-BR',
    pt: 'pt-BR',
    en: 'en-US',
  };
  return map[locale] ?? 'en-US';
}

/**
 * Format a date value for display
 */
function formatDate(value: unknown, dateLocale: string): string {
  if (!value) return '';

  if (typeof value === 'string') {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString(dateLocale, {
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

/**
 * Render an object value as formatted key-value pairs
 */
function renderObjectValue(value: Record<string, unknown>) {
  const entries = Object.entries(value);
  if (entries.length === 0) return null;

  return (
    <dl style={{ margin: 0, paddingLeft: '8px' }}>
      {entries.map(([key, val]) => (
        <div key={key} style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
          <dt style={{ fontWeight: 500, color: '#888' }}>{humanizeFieldKey(key)}:</dt>
          <dd style={{ margin: 0 }}>
            {typeof val === 'object' && val !== null
              ? JSON.stringify(val, null, 2)
              : String(val ?? '')}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Render a non-string value with graceful handling of objects and arrays
 */
function renderValue(value: unknown): React.ReactNode {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(String).join(', ');
  if (typeof value === 'object') return renderObjectValue(value as Record<string, unknown>);
  return String(value);
}

/**
 * Generate a stable key for an array item
 */
function itemKey(item: unknown, index: number): string {
  if (typeof item === 'string') return `${item}-${index}`;
  if (typeof item === 'object' && item !== null && 'id' in item)
    return String((item as { id: unknown }).id);
  return String(index);
}

export function GenericFieldRenderer({
  fieldKey,
  value,
  isHeader = false,
  isDate = false,
  isDescription = false,
  styles,
}: GenericFieldRendererProps) {
  const { language } = useI18n();
  const dateLocale = toDateLocale(language);

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

    return <div style={headerStyle}>{renderValue(value)}</div>;
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
        {formatDate(value, dateLocale)}
      </span>
    );
  }

  // Description style (normal body text)
  if (isDescription) {
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
            <li key={itemKey(item, index)} style={{ marginBottom: '4px' }}>
              {renderValue(item)}
            </li>
          ))}
        </ul>
      );
    }

    return <p style={{ ...bodyStyle, margin: '8px 0' }}>{renderValue(value)}</p>;
  }

  // Default: show label and value
  if (Array.isArray(value)) {
    return (
      <div style={{ ...bodyStyle, marginBottom: '4px' }}>
        <span style={{ fontWeight: 500, marginRight: '4px' }}>{humanizeFieldKey(fieldKey)}:</span>
        {value.map(String).join(', ')}
      </div>
    );
  }

  // Handle objects
  if (typeof value === 'object') {
    return (
      <div style={{ ...bodyStyle, marginBottom: '4px' }}>
        <span style={{ fontWeight: 500, marginRight: '4px' }}>{humanizeFieldKey(fieldKey)}:</span>
        {renderObjectValue(value as Record<string, unknown>)}
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
