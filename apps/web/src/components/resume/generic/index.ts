/**
 * Generic Resume Section Components
 *
 * These components render sections dynamically based on backend-provided
 * metadata. No hardcoded section types - the backend defines:
 * - Section type keys (e.g., "work_experience_v1", "skill_set_v1")
 * - Semantic kinds (e.g., "WORK_EXPERIENCE", "SKILL_SET")
 * - Field definitions and validation rules
 *
 * Frontend renders based on content structure and semantic hints.
 */

// Editor components (for settings pages)
export { GenericFieldInput } from './generic-field-input';
// Display components (for resume preview)
export { GenericFieldRenderer } from './generic-field-renderer';
export { GenericItemRenderer } from './generic-item-renderer';
export { GenericSectionEditor } from './generic-section-editor';
export { GenericSectionRenderer } from './generic-section-renderer';
