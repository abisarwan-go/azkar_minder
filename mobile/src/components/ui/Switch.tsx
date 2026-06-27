import { Pressable, StyleSheet, View } from "react-native";
import { Radius } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
}

export function Switch({ value, onValueChange, accessibilityLabel }: SwitchProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        {
          backgroundColor: value ? colors.primary : colors.muted,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.thumb,
          {
            backgroundColor: colors.card,
            transform: [{ translateX: value ? 20 : 2 }],
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: Radius.lg,
    borderWidth: 1,
    justifyContent: "center",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
});
