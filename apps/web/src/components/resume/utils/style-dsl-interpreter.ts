/**
 * Style DSL Interpreter Stubs
 *
 * Note: Full DSL interpretation should happen on the backend.
 * This file provides minimal frontend utilities for rendering.
 * Backend should provide pre-computed styles.
 */

export interface FieldStyles {
  class?: string;
  inline?: Record<string, string>;
  [key: string]: string | Record<string, string> | undefined;
}

export interface RenderHints {
  layout?: 'inline' | 'block' | 'grid';
  variant?: 'default' | 'compact' | 'detailed';
  columns?: number;
  showDividers?: boolean;
}

export interface RenderClasses {
  containerClass: string;
  itemClass: string;
  dividerClass: string;
}

/** Convert field styles to class string */
export function fieldStyleToClasses(styles?: FieldStyles): string {
  return styles?.class ?? '';
}

/** Get semantic role class */
export function getSemanticRoleClass(
  role?: 'TITLE' | 'SUBTITLE' | 'DATE_START' | 'DATE_END' | 'DESCRIPTION',
): string {
  const roleClasses: Record<string, string> = {
    TITLE: 'text-lg font-semibold',
    SUBTITLE: 'text-sm text-gray-600',
    DATE_START: 'text-sm text-gray-500',
    DATE_END: 'text-sm text-gray-500',
    DESCRIPTION: 'text-sm',
  };
  return role ? (roleClasses[role] ?? '') : '';
}

/** Convert render hints to class object */
export function renderHintsToClasses(hints?: RenderHints): RenderClasses {
  const result: RenderClasses = {
    containerClass: '',
    itemClass: '',
    dividerClass: 'border-t border-gray-200 my-2',
  };

  if (!hints) return result;

  const containerClasses: string[] = [];
  if (hints.layout === 'grid' && hints.columns) {
    containerClasses.push(`grid grid-cols-${hints.columns} gap-4`);
  } else if (hints.layout === 'inline') {
    containerClasses.push('flex flex-wrap gap-2');
  }
  if (hints.variant === 'compact') {
    containerClasses.push('space-y-1');
  } else {
    containerClasses.push('space-y-4');
  }

  result.containerClass = containerClasses.join(' ');
  return result;
}
