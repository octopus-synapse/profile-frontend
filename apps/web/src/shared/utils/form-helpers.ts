/**
 * Form Helper Utilities
 * Reusable functions for form validation and formatting
 */

/**
 * Formats a date string to a readable format
 *
 * @param dateStr - ISO date string
 * @returns Formatted date (e.g., "Jan 2024")
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * Validates required fields in form data
 *
 * @param data - Form data object
 * @param requiredFields - Array of required field names
 * @returns True if all required fields are filled
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): boolean {
  return requiredFields.every((field) => {
    const value = data[field];
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    return value != null;
  });
}

/**
 * Confirms deletion with user
 *
 * @param itemName - Name of the item type (e.g., "education", "skill")
 * @returns True if user confirmed deletion
 */
export function confirmDelete(itemName: string): boolean {
  return confirm(`Are you sure you want to delete this ${itemName}?`);
}
