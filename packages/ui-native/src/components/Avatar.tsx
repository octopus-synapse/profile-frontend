/**
 * Avatar Component for React Native
 */

import React from "react";
import {
 View,
 Image,
 Text,
 StyleSheet,
 type ImageSourcePropType,
} from "react-native";
import { colors, fontSize, fontWeight, borderRadius } from "../tokens";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
 source?: ImageSourcePropType | string;
 name?: string;
 size?: AvatarSize;
}

const sizeMap: Record<AvatarSize, number> = {
 xs: 24,
 sm: 32,
 md: 40,
 lg: 56,
 xl: 80,
};

const fontSizeMap: Record<AvatarSize, number> = {
 xs: fontSize.xs,
 sm: fontSize.sm,
 md: fontSize.base,
 lg: fontSize.xl,
 xl: fontSize["3xl"],
};

function getInitials(name: string): string {
 return name
  .split(" ")
  .map((n) => n[0])
  .join("")
  .toUpperCase()
  .slice(0, 2);
}

export function Avatar({ source, name, size = "md" }: AvatarProps) {
 const dimension = sizeMap[size];
 const textSize = fontSizeMap[size];

 const containerStyle = {
  width: dimension,
  height: dimension,
  borderRadius: dimension / 2,
 };

 if (source) {
  const imageSource = typeof source === "string" ? { uri: source } : source;
  return (
   <Image
    source={imageSource}
    style={[styles.image, containerStyle]}
    resizeMode="cover"
   />
  );
 }

 return (
  <View style={[styles.fallback, containerStyle]}>
   <Text style={[styles.initials, { fontSize: textSize }]}>
    {name ? getInitials(name) : "?"}
   </Text>
  </View>
 );
}

const styles = StyleSheet.create({
 image: {
  backgroundColor: colors.gray[200],
 },
 fallback: {
  backgroundColor: colors.primary,
  alignItems: "center",
  justifyContent: "center",
 },
 initials: {
  color: colors.white,
  fontWeight: fontWeight.semibold,
 },
});
