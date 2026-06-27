import { getColors, type ThemeColors } from "@/constants/theme";
import { useAppColorScheme } from "@/hooks/use-app-color-scheme";

export function useThemeColors(): ThemeColors {
  return getColors(useAppColorScheme());
}
