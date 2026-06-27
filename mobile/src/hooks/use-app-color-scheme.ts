import { useColorScheme } from "react-native";
import { useSettings } from "@/hooks/storage";

export function useAppColorScheme(): "light" | "dark" {
  const system = useColorScheme();
  const { settings } = useSettings();

  if (settings.theme === "system") {
    return system === "dark" ? "dark" : "light";
  }
  return settings.theme;
}
