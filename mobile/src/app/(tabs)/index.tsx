import { Link, useRouter, type Href } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import type { ThemeColors } from "@/constants/theme";
import { FEATURED_CHAPTERS } from "@/data/featured-chapters";
import { useArabicTextStyle } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";

const GRID_GAP = Spacing.md - 4;
const COLUMNS = 2;

function useGridCardWidth() {
  const { width } = useWindowDimensions();
  const horizontalPadding = Spacing.md * 2;
  return Math.floor((width - horizontalPadding - GRID_GAP) / COLUMNS);
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

type CardVariant = "default" | "primary" | "gold";

interface GridCardItem {
  key: string;
  href: Href;
  emoji: string;
  label: string;
  subtitle: string;
  variant: CardVariant;
}

function cardColors(variant: CardVariant, colors: ThemeColors) {
  switch (variant) {
    case "primary":
      return {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
        titleColor: colors.primaryForeground,
        subtitleColor: colors.primaryForeground,
      };
    case "gold":
      return {
        backgroundColor: colors.gold,
        borderColor: colors.gold,
        titleColor: colors.goldForeground,
        subtitleColor: colors.goldForeground,
      };
    default:
      return {
        backgroundColor: colors.card,
        borderColor: colors.border,
        titleColor: colors.foreground,
        subtitleColor: colors.mutedForeground,
      };
  }
}

function GridCard({
  item,
  cardWidth,
  colors,
}: {
  item: GridCardItem;
  cardWidth: number;
  colors: ThemeColors;
}) {
  const router = useRouter();
  const palette = cardColors(item.variant, colors);

  return (
    <View style={{ width: cardWidth }}>
      <Pressable
        onPress={() => router.push(item.href)}
        style={({ pressed }) => [
          styles.gridCard,
          {
            backgroundColor: palette.backgroundColor,
            borderColor: palette.borderColor,
          },
          pressed && styles.gridCardPressed,
        ]}
      >
        <Text style={styles.chapterEmoji}>{item.emoji}</Text>
        <Text style={[styles.chapterLabel, { color: palette.titleColor }]}>{item.label}</Text>
        <Text
          style={[styles.chapterSubtitle, { color: palette.subtitleColor }]}
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>
      </Pressable>
    </View>
  );
}

function TwoColumnGrid({
  items,
  cardWidth,
  colors,
}: {
  items: GridCardItem[];
  cardWidth: number;
  colors: ThemeColors;
}) {
  const rows = chunk(items, COLUMNS);

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.gridRow, { gap: GRID_GAP }]}>
          {row.map((item) => (
            <GridCard key={item.key} item={item} cardWidth={cardWidth} colors={colors} />
          ))}
          {row.length < COLUMNS
            ? Array.from({ length: COLUMNS - row.length }).map((_, i) => (
                <View key={`spacer-${i}`} style={{ width: cardWidth }} />
              ))
            : null}
        </View>
      ))}
    </View>
  );
}

const FEATURED_ITEMS: GridCardItem[] = FEATURED_CHAPTERS.map((chapter) => ({
  key: chapter.slug,
  href: `/chapter/${chapter.slug}` as Href,
  emoji: chapter.emoji,
  label: chapter.label,
  subtitle: chapter.subtitle,
  variant: "default",
}));

const SHORTCUT_ITEMS: GridCardItem[] = [
  {
    key: "tasbih",
    href: "/tasbih",
    emoji: "📿",
    label: "Tasbih",
    subtitle: "Digital counter",
    variant: "primary",
  },
  {
    key: "favorites",
    href: "/favorites",
    emoji: "⭐",
    label: "Favorites",
    subtitle: "Saved adhkar",
    variant: "gold",
  },
];

export default function HomeScreen() {
  const colors = useThemeColors();
  const bismillahArabic = useArabicTextStyle(20);
  const cardWidth = useGridCardWidth();
  const hour = new Date().getHours();
  const greeting = getGreeting(hour);
  const greetingIcon = hour < 18 ? "sunny-outline" : "moon-outline";

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.greetingRow}>
            <Ionicons name={greetingIcon} size={14} color={colors.gold} />
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
              {greeting}, may Allah bless you
            </Text>
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Azkar Muslim</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Authentic adhkar from Hisn al-Muslim — Arabic, transliteration, and English.
          </Text>
        </View>

        <View
          style={[
            styles.bismillahCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Ionicons name="sparkles" size={20} color={colors.gold} />
          <View style={styles.bismillahText}>
            <Text
              style={[
                styles.bismillahArabic,
                {
                  color: colors.foreground,
                  fontFamily: bismillahArabic.fontFamily,
                  lineHeight: bismillahArabic.lineHeight,
                },
              ]}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </Text>
            <Text style={[styles.bismillahTranslation, { color: colors.mutedForeground }]}>
              In the name of Allah, the Most Gracious, the Most Merciful.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Daily essentials
            </Text>
            <Link href="/chapters" asChild>
              <Pressable style={styles.viewAll} hitSlop={8}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View all</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.primary} />
              </Pressable>
            </Link>
          </View>
          <TwoColumnGrid items={FEATURED_ITEMS} cardWidth={cardWidth} colors={colors} />
        </View>

        <TwoColumnGrid items={SHORTCUT_ITEMS} cardWidth={cardWidth} colors={colors} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.lg + 8,
  },
  header: { paddingTop: Spacing.lg, gap: Spacing.sm },
  greetingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  greeting: { fontFamily: Fonts.sans, fontSize: 12 },
  title: { fontFamily: Fonts.sansBold, fontSize: 28, letterSpacing: -0.5 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 22 },
  bismillahCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md - 4,
    padding: Spacing.md + 4,
    borderRadius: Radius.xl,
    borderWidth: 1,
  },
  bismillahText: { flex: 1, gap: 4 },
  bismillahArabic: {
    fontSize: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  bismillahTranslation: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  section: { gap: Spacing.md },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: { fontFamily: Fonts.sansSemiBold, fontSize: 16 },
  viewAll: { flexDirection: "row", alignItems: "center", gap: 2, minHeight: 44 },
  viewAllText: { fontFamily: Fonts.sansMedium, fontSize: 12 },
  grid: { gap: GRID_GAP },
  gridRow: { flexDirection: "row", width: "100%" },
  gridCard: {
    width: "100%",
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    gap: 4,
  },
  gridCardPressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  chapterEmoji: { fontSize: 24, alignSelf: "flex-start" },
  chapterLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 14, alignSelf: "stretch" },
  chapterSubtitle: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 16, opacity: 0.9, alignSelf: "stretch" },
});
