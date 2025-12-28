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
// ============================================
export {
  // Components
  Button,
  type ButtonProps,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
  Badge,
  type BadgeProps,
  Input,
  type InputProps,
  Avatar,
  type AvatarProps,
  Spinner,
  type SpinnerProps,
  Separator,
  type SeparatorProps,
  Skeleton,
  type SkeletonProps,
  // Primitives
  Box,
  type BoxProps,
  Stack,
  type StackProps,
  Grid,
  type GridProps,
  Text,
  type TextProps,
  // Utils
  cn,
} from "@octopus-synapse/profile-ui";

// ============================================
// LOCAL COMPONENTS
// Specific to profile-frontend, use Radix UI
// ============================================

// Form elements
export * from "./textarea";
export * from "./label";
export * from "./checkbox";
export * from "./switch";
export * from "./select";
export * from "./autocomplete";
export * from "./phone-input";
export * from "./language-toggle";

// Layout
export * from "./scroll-area";
export * from "./tabs";

// Feedback
export * from "./progress";
export * from "./alert";
export * from "./toast";
export * from "./empty-state";

// Overlays
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./tooltip";
