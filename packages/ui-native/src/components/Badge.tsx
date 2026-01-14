/**
 * Badge Component for React Native
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../tokens";

export type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={[styles.text, styles[`text_${variant}`]]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },

  // Variants
  default: {
    backgroundColor: colors.gray[200],
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  success: {
    backgroundColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  error: {
    backgroundColor: colors.error,
  },

  // Text
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  text_default: {
    color: colors.text.primary,
  },
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.white,
  },
  text_success: {
    color: colors.white,
  },
  text_warning: {
    color: colors.white,
  },
  text_error: {
    color: colors.white,
  },
});
