import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface ChapterRowProps {
  slug: string;
  chapterNumber: number;
  title: string;
  subtitle?: string;
}

export function ChapterRow({ slug, chapterNumber, title, subtitle }: ChapterRowProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/chapter/${slug}`)}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.badge, { backgroundColor: colors.accent }]}>
        <Text style={[styles.badgeText, { color: colors.primary }]}>{chapterNumber}</Text>
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={colors.mutedForeground}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md - 4,
    borderWidth: 1,
    borderRadius: Radius.lg,
    minHeight: 56,
    gap: Spacing.md - 4,
  },
  pressed: {
    opacity: 0.85,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: Radius.md - 4,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 12,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontFamily: Fonts.sansMedium,
    fontSize: 14,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  chevron: {
    flexShrink: 0,
  },
});
