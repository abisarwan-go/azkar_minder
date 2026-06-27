import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

/** Minimum touch target per Material / Apple HIG (finger, not cursor). */
const MIN_TOUCH = 48;

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

/** Minimal look, 48dp touch area — highlight only while pressed. */
export function BackButton({ onPress, label = "Back" }: BackButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 16 }}
      android_ripple={{ color: colors.mutedForeground + "28", borderless: false, radius: Radius.md }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: pressed ? colors.muted : "transparent",
        },
      ]}
    >
      {({ pressed }) => (
        <>
          <Ionicons
            name="chevron-back"
            size={20}
            color={pressed ? colors.foreground : colors.mutedForeground}
          />
          <Text
            style={[
              styles.label,
              { color: pressed ? colors.foreground : colors.mutedForeground },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    minHeight: MIN_TOUCH,
    minWidth: MIN_TOUCH,
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.sm + 4,
    marginLeft: -(Spacing.md - 4),
    borderRadius: Radius.md,
    gap: 2,
  },
  label: {
    fontFamily: Fonts.sansMedium,
    fontSize: 15,
    lineHeight: 20,
  },
});
