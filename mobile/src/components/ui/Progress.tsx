import { StyleSheet, View, type ViewStyle } from "react-native";
import { Radius } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface ProgressProps {
  value: number;
  style?: ViewStyle;
}

export function Progress({ value, style }: ProgressProps) {
  const colors = useThemeColors();
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View style={[styles.track, { backgroundColor: colors.muted }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: colors.primary,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: Radius.md,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.md,
  },
});
