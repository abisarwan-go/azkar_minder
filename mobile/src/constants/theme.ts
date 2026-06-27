import type { ColorSchemeName } from "react-native";

export const Colors = {
  light: {
    background: "#f9f8f5",
    foreground: "#1a2e24",
    card: "#ffffff",
    cardForeground: "#1a2e24",
    primary: "#2d6a4f",
    primaryForeground: "#f9f8f5",
    secondary: "#ede8dc",
    secondaryForeground: "#2a4034",
    muted: "#f0ede6",
    mutedForeground: "#5c6b62",
    accent: "#dceee4",
    accentForeground: "#2a4034",
    gold: "#c9a227",
    goldForeground: "#3d3010",
    destructive: "#c0392b",
    border: "#e0dcd4",
    input: "#ebe8e2",
    ring: "#2d6a4f",
  },
  dark: {
    background: "#141f1a",
    foreground: "#f2f0eb",
    card: "#1a2822",
    cardForeground: "#f2f0eb",
    primary: "#5cb88a",
    primaryForeground: "#141f1a",
    secondary: "#243329",
    secondaryForeground: "#f2f0eb",
    muted: "#243329",
    mutedForeground: "#9aab9f",
    accent: "#2d4a3a",
    accentForeground: "#f2f0eb",
    gold: "#d4ad2e",
    goldForeground: "#3d3010",
    destructive: "#e05545",
    border: "rgba(255,255,255,0.1)",
    input: "rgba(255,255,255,0.12)",
    ring: "#5cb88a",
  },
} as const;

export type ThemeColors = (typeof Colors)["light"] | (typeof Colors)["dark"];

export const ArabicSizes = {
  sm: 24,
  md: 30,
  lg: 36,
  xl: 44,
} as const;

/** Matches web `.font-arabic { line-height: 2.1 }` */
export const ArabicLineHeightRatio = 2.1;

export function getArabicLineHeight(fontSize: number): number {
  return Math.round(fontSize * ArabicLineHeightRatio);
}

export type ArabicSize = keyof typeof ArabicSizes;

export const Fonts = {
  arabic: "Amiri_400Regular",
  arabicBold: "Amiri_700Bold",
  sans: "Inter_400Regular",
  sansMedium: "Inter_500Medium",
  sansSemiBold: "Inter_600SemiBold",
  sansBold: "Inter_700Bold",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
} as const;

export function getColors(scheme: ColorSchemeName): ThemeColors {
  return scheme === "dark" ? Colors.dark : Colors.light;
}
