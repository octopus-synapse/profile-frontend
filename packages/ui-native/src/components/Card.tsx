/**
 * Card Component for React Native
 */

import React from "react";
import {
 View,
 StyleSheet,
 type ViewProps,
 type StyleProp,
 type ViewStyle,
} from "react-native";
import { colors, spacing, borderRadius, shadow } from "../tokens";

export interface CardProps extends ViewProps {
 variant?: "elevated" | "outlined" | "filled";
 padding?: keyof typeof spacing;
}

export function Card({
 variant = "elevated",
 padding = 4,
 style,
 children,
 ...props
}: CardProps) {
 return (
  <View
   style={[styles.base, styles[variant], { padding: spacing[padding] }, style]}
   {...props}
  >
   {children}
  </View>
 );
}

const styles = StyleSheet.create({
 base: {
  borderRadius: borderRadius.lg,
  backgroundColor: colors.background.primary,
 },
 elevated: {
  ...shadow.md,
 },
 outlined: {
  borderWidth: 1,
  borderColor: colors.border.light,
 },
 filled: {
  backgroundColor: colors.gray[100],
 },
});
