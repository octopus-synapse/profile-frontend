/**
 * Theme Factory
 * Creates mock theme entities for testing
 */

export interface ThemeColors {
 primary: string;
 secondary: string;
 background: string;
 text: string;
 accent: string;
}

export interface ThemeFactoryOptions {
 id?: string;
 name?: string;
 description?: string;
 isSystem?: boolean;
 colors?: Partial<ThemeColors>;
 fontFamily?: string;
 createdAt?: Date;
}

export interface MockTheme {
 id: string;
 name: string;
 description: string | null;
 isSystem: boolean;
 colors: ThemeColors;
 fontFamily: string;
 createdAt: Date;
}

let themeIdCounter = 1;

const defaultColors: ThemeColors = {
 primary: "#3B82F6",
 secondary: "#6B7280",
 background: "#FFFFFF",
 text: "#1F2937",
 accent: "#10B981",
};

/**
 * Create a mock theme with sensible defaults
 */
export function createTheme(options: ThemeFactoryOptions = {}): MockTheme {
 const id = options.id ?? `theme-${themeIdCounter++}`;

 return {
  id,
  name: options.name ?? `Theme ${id}`,
  description: options.description ?? null,
  isSystem: options.isSystem ?? false,
  colors: { ...defaultColors, ...options.colors },
  fontFamily: options.fontFamily ?? "Inter",
  createdAt: options.createdAt ?? new Date(),
 };
}

/**
 * Create a system theme
 */
export function createSystemTheme(
 options: Omit<ThemeFactoryOptions, "isSystem"> = {}
): MockTheme {
 return createTheme({ ...options, isSystem: true });
}

/**
 * Create a dark theme
 */
export function createDarkTheme(options: ThemeFactoryOptions = {}): MockTheme {
 return createTheme({
  ...options,
  name: options.name ?? "Dark Theme",
  colors: {
   primary: "#60A5FA",
   secondary: "#9CA3AF",
   background: "#1F2937",
   text: "#F9FAFB",
   accent: "#34D399",
   ...options.colors,
  },
 });
}

/**
 * Create multiple themes
 */
export function createThemes(
 count: number,
 options: ThemeFactoryOptions = {}
): MockTheme[] {
 return Array.from({ length: count }, () => createTheme(options));
}

/**
 * Create default system themes
 */
export function createDefaultSystemThemes(): MockTheme[] {
 return [
  createSystemTheme({ name: "Default Light", colors: defaultColors }),
  createSystemTheme({
   name: "Default Dark",
   colors: {
    primary: "#60A5FA",
    secondary: "#9CA3AF",
    background: "#1F2937",
    text: "#F9FAFB",
    accent: "#34D399",
   },
  }),
  createSystemTheme({
   name: "Professional",
   colors: {
    primary: "#1E40AF",
    secondary: "#475569",
    background: "#F8FAFC",
    text: "#0F172A",
    accent: "#0D9488",
   },
  }),
 ];
}

/**
 * Reset the theme ID counter (use in beforeEach for consistent IDs)
 */
export function resetThemeFactory(): void {
 themeIdCounter = 1;
}
