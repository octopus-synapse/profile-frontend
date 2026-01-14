/**
 * Button Component for React Native
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type TouchableOpacityProps,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native";
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../tokens";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  children,
  style,
  textStyle,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? colors.primary : colors.white}
        />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`text_${size}`], textStyle]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius.md,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.gray[200],
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  destructive: {
    backgroundColor: colors.error,
  },

  // Sizes
  size_sm: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    minHeight: 32,
  },
  size_md: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    minHeight: 44,
  },
  size_lg: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[4],
    minHeight: 52,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: "100%",
  },

  // Text base
  text: {
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },

  // Text variants
  text_primary: {
    color: colors.white,
  },
  text_secondary: {
    color: colors.text.primary,
  },
  text_outline: {
    color: colors.primary,
  },
  text_ghost: {
    color: colors.primary,
  },
  text_destructive: {
    color: colors.white,
  },

  // Text sizes
  text_sm: {
    fontSize: fontSize.sm,
  },
  text_md: {
    fontSize: fontSize.base,
  },
  text_lg: {
    fontSize: fontSize.lg,
  },
});
