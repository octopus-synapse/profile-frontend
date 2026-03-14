/**
 * UI Components barrel export
 *
 * Components from @octopus-synapse/profile-ui are re-exported here.
 * The profile-ui design system uses CSS variables that automatically
 * map to our --pf-* tokens defined in globals.css.
 */

// ============================================
// FROM @octopus-synapse/profile-ui
// Core components from shared design system
// Note: Types (except ButtonProps) are not exported by the design system
// ============================================
export {
  Avatar,
  Badge,
  // Components
  Button,
  type ButtonProps,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  // Utils
  cn,
  EmptyState as DesignSystemEmptyState,
  Input,
  LoadingState,
  Separator,
  Skeleton,
  Spinner,
} from '@octopus-synapse/profile-ui';

// ============================================
// LOCAL COMPONENTS
// Specific to profile-frontend, use Radix UI
// ============================================

export * from './alert';
export * from './autocomplete';
export * from './checkbox';
// Overlays
export * from './dialog';
export * from './dropdown-menu';
export * from './empty-state';
export * from './label';
export * from './language-toggle';
export * from './phone-input';
// Feedback
export * from './progress';
// Layout
export * from './scroll-area';
export * from './select';
export * from './switch';
export * from './tabs';
// Form elements
export * from './textarea';
export * from './toast';
export * from './tooltip';
