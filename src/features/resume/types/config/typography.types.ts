/**
 * Typography Design Tokens
 * Font families, sizes, and text styling
 */

export type FontFamily =
  | "inter"
  | "roboto"
  | "poppins"
  | "montserrat"
  | "open-sans"
  | "lato"
  | "merriweather"
  | "playfair"
  | "source-serif"
  | "fira-code"
  | "jetbrains-mono";

export type FontSize = "xs" | "sm" | "base" | "lg" | "xl";
export type FontWeight = "normal" | "medium" | "semibold" | "bold";
export type HeadingStyle =
  | "bold"
  | "underline"
  | "accent-border"
  | "accent-bg"
  | "uppercase"
  | "icon-prefix";

export interface TypographyTokens {
  fontFamily: {
    heading: FontFamily;
    body: FontFamily;
  };
  fontSize: FontSize;
  headingStyle: HeadingStyle;
  headingWeight?: FontWeight;
  bodyWeight?: FontWeight;
  lineHeight?: "tight" | "normal" | "relaxed";
}

export const DEFAULT_TYPOGRAPHY: TypographyTokens = {
  fontFamily: { heading: "inter", body: "inter" },
  fontSize: "base",
  headingStyle: "bold",
  headingWeight: "bold",
  bodyWeight: "normal",
  lineHeight: "normal",
};
