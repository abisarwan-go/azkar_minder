import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AzkarCard } from "@/components/AzkarCard";
import { BackButton } from "@/components/BackButton";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { getChapter } from "@/data/hisn/load";
import { useArabicTextStyle } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { getTranslation } from "@/lib/translation";

export default function ChapterScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const colors = useThemeColors();
  const titleArabic = useArabicTextStyle(18);
  const chapter = slug ? getChapter(slug) : undefined;

  if (!chapter) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.foreground }]}>
            Chapter not found
          </Text>
          <BackButton onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const title = getTranslation(chapter.title.translations);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={[styles.chapterNumber, { color: colors.mutedForeground }]}>
            Chapter {chapter.chapterNumber}
          </Text>
          <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
            {title}
          </Text>
          <Text
            style={[
              styles.titleArabic,
              {
                color: colors.mutedForeground,
                fontFamily: titleArabic.fontFamily,
                lineHeight: titleArabic.lineHeight,
              },
            ]}
          >
            {chapter.title.arabic}
          </Text>
        </View>
      </View>

      <FlatList
        data={chapter.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AzkarCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    gap: Spacing.sm + 4,
  },
  headerText: {
    gap: 4,
  },
  chapterNumber: {
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  title: {
    fontFamily: Fonts.sansSemiBold,
    fontSize: 20,
  },
  titleArabic: {
    fontSize: 18,
    textAlign: "right",
    writingDirection: "rtl",
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  separator: {
    height: Spacing.md,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  notFoundText: {
    fontFamily: Fonts.sansMedium,
    fontSize: 16,
  },
});
