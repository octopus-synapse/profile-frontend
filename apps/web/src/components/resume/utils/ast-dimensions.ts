/**
 * AST Dimension Utilities
 * Converts millimeters to pixels and calculates layout dimensions
 */

// Standard DPI for screen rendering (96 DPI = 1 inch)
const MM_TO_PX_RATIO = 96 / 25.4; // 25.4mm = 1 inch

/**
 * Converts millimeters to pixels for screen rendering
 */
export function mmToPx(mm: number): number {
  return Math.round(mm * MM_TO_PX_RATIO);
}

/**
 * Calculates usable page width (excluding margins)
 */
export function getUsablePageWidth(page: {
  widthMm: number;
  marginLeftMm: number;
  marginRightMm: number;
}): number {
  const totalWidth = mmToPx(page.widthMm);
  const marginLeft = mmToPx(page.marginLeftMm);
  const marginRight = mmToPx(page.marginRightMm);
  return totalWidth - marginLeft - marginRight;
}

/**
 * Calculates usable page height (excluding margins)
 */
export function getUsablePageHeight(page: {
  heightMm: number;
  marginTopMm: number;
  marginBottomMm: number;
}): number {
  const totalHeight = mmToPx(page.heightMm);
  const marginTop = mmToPx(page.marginTopMm);
  const marginBottom = mmToPx(page.marginBottomMm);
  return totalHeight - marginTop - marginBottom;
}

/**
 * Calculates column width in pixels based on percentage and usable page width
 */
export function getColumnWidthPx(
  column: { widthPercentage: number },
  usablePageWidth: number
): number {
  return Math.round((usablePageWidth * column.widthPercentage) / 100);
}

/**
 * Calculates column gap in pixels
 */
export function getColumnGapPx(columnGapMm: number): number {
  return mmToPx(columnGapMm);
}

/**
 * Gets page padding (margins) in pixels
 */
export function getPagePadding(page: {
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
}): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  return {
    top: mmToPx(page.marginTopMm),
    bottom: mmToPx(page.marginBottomMm),
    left: mmToPx(page.marginLeftMm),
    right: mmToPx(page.marginRightMm),
  };
}
