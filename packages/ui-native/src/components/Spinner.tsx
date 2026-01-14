/**
 * Spinner Component for React Native
 */

import React from "react";
import { ActivityIndicator, View, StyleSheet, type ViewProps } from "react-native";
import { colors } from "../tokens";

export type SpinnerSize = "small" | "large";

export interface SpinnerProps extends ViewProps {
  size?: SpinnerSize;
  color?: string;
}

export function Spinner({ size = "small", color = colors.primary, style, ...props }: SpinnerProps) {
  return (
    <View style={[styles.container, style]} {...props}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
