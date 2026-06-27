import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

type ButtonVariant = "primary" | "outline" | "ghost" | "gold";
type ButtonSize = "default" | "icon";

interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  variant = "primary",
  size = "default",
  label,
  children,
  disabled,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: { backgroundColor: colors.primary },
    gold: { backgroundColor: colors.gold },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
    },
    ghost: { backgroundColor: "transparent" },
  };

  const textColors: Record<ButtonVariant, string> = {
    primary: colors.primaryForeground,
    gold: colors.goldForeground,
    outline: colors.foreground,
    ghost: colors.foreground,
  };

  const isIcon = size === "icon";

  return (
    <Pressable
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        isIcon ? styles.icon : styles.default,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
      {...props}
    >
      {children ??
        (label ? (
          <Text
            style={[
              styles.label,
              { color: textColors[variant] },
              disabled && { opacity: 0.6 },
              textStyle,
            ]}
          >
            {label}
          </Text>
        ) : null)}
    </Pressable>
  );
}

export function ButtonSpinner() {
  const colors = useThemeColors();
  return <ActivityIndicator color={colors.primaryForeground} />;
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.lg,
  },
  default: {
    flex: 1,
    height: 48,
    paddingHorizontal: Spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
  },
  label: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
