/**
 * Input Component for React Native
 */

import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { colors, spacing, fontSize, borderRadius } from "../tokens";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export function Input({
  label,
  error,
  hint,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.text.tertiary}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    fontSize: fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginTop: spacing[1],
  },
  hint: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: spacing[1],
  },
});
