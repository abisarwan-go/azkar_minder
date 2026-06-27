import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

export function Input(props: TextInputProps) {
  const colors = useThemeColors();

  return (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      {...props}
      style={[
        styles.input,
        {
          color: colors.foreground,
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md - 4,
    paddingVertical: Spacing.sm + 4,
    minHeight: 44,
  },
});
