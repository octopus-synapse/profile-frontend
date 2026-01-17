/**
 * UI Primitives
 * Provides unified primitives using react-native with NativeWind support
 *
 * This module bridges design tokens from profile-ui with native components.
 *
 * Usage:
 * import { View, Text, palette } from "@/ui";
 */

// Re-export react-native components with NativeWind className support
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
  Dimensions,
  StatusBar,
  SafeAreaView,
  Modal,
} from "react-native";

// Re-export types from react-native
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
  ModalProps,
} from "react-native";

// Re-export design system tokens from profile-ui
export {
  designSystem,
  palette,
  space,
  radii,
  fontSizes,
  lineHeights,
  fontWeights,
  shadows,
  button,
  input,
  card,
  badge,
  toCSS,
} from "@octopus-synapse/profile-ui/tokens";
