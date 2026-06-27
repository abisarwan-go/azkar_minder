import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

type TabIcon = keyof typeof Ionicons.glyphMap;

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (name: string) => void;
  };
}

const TAB_CONFIG: Record<
  string,
  { label: string; active: TabIcon; inactive: TabIcon }
> = {
  index: { label: "Home", active: "home", inactive: "home-outline" },
  chapters: { label: "Chapters", active: "grid", inactive: "grid-outline" },
  tasbih: { label: "Tasbih", active: "ellipse", inactive: "ellipse-outline" },
  favorites: { label: "Favorites", active: "heart", inactive: "heart-outline" },
  settings: { label: "Settings", active: "settings", inactive: "settings-outline" },
};

export function TabBar({ state, navigation }: TabBarProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, Spacing.sm) }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name] ?? {
            label: route.name,
            active: "ellipse" as TabIcon,
            inactive: "ellipse-outline" as TabIcon,
          };
          const active = state.index === index;
          const color = active ? colors.primary : colors.mutedForeground;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={config.label}
              style={({ pressed }) => [
                styles.tab,
                active && { backgroundColor: colors.accent },
                pressed && styles.tabPressed,
              ]}
            >
              <Ionicons
                name={active ? config.active : config.inactive}
                size={22}
                color={color}
              />
              <Text style={[styles.tabLabel, { color }]}>{config.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.md - 4,
    paddingTop: Spacing.sm,
  },
  bar: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.md,
    gap: 2,
  },
  tabPressed: {
    opacity: 0.75,
  },
  tabLabel: {
    fontFamily: Fonts.sansMedium,
    fontSize: 10,
  },
});
