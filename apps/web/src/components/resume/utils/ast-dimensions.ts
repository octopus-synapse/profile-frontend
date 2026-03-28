/**
 * AST Dimensions Utils
 * Simple unit conversions for rendering
 *
 * Note: These are frontend-only utilities for pure rendering.
 * No business logic - just unit conversions.
 */

/** Convert millimeters to pixels at 96 DPI */
export function mmToPx(mm: number): number {
  return (mm * 96) / 25.4;
}

/** Convert pixels to millimeters at 96 DPI */
export function pxToMm(px: number): number {
  return (px * 25.4) / 96;
}
