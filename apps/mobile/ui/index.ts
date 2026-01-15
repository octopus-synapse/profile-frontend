/**
 * UI Components Re-exports
 * Exposes profile-ui native primitives for use in the mobile app
 *
 * Usage:
 * import { View, Text, Pressable } from "../ui";
 *
 * Note: For now, we're using react-native components directly
 * with NativeWind className support. When profile-ui is properly
 * linked as a workspace dependency, switch to:
 *
 * export * from "@octopus-synapse/profile-ui/primitives/native";
 */

// Re-export react-native components with className support via NativeWind
export {
 View,
 Text,
 Pressable,
 Image,
 TextInput,
 ScrollView,
 ActivityIndicator,
 TouchableOpacity,
 FlatList,
 KeyboardAvoidingView,
 Alert,
 Platform,
} from "react-native";

// Type exports for consistent typing
export type {
 ViewProps,
 TextProps,
 PressableProps,
 ImageProps,
 TextInputProps,
 ScrollViewProps,
 ActivityIndicatorProps,
 TouchableOpacityProps,
 FlatListProps,
 KeyboardAvoidingViewProps,
} from "react-native";
