import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChapterRow } from "@/components/ChapterRow";
import { SearchInput } from "@/components/ui/SearchInput";
import { Fonts, Spacing } from "@/constants/theme";
import { getAllChapters } from "@/data/hisn/load";
import searchIndex from "@/data/hisn/search-index.json";
import type { HisnSearchEntry } from "@/data/hisn/types";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { getTranslation } from "@/lib/translation";

const SEARCH_INDEX = searchIndex as HisnSearchEntry[];

export default function ChaptersScreen() {
  const colors = useThemeColors();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const chapters = getAllChapters();

  const filteredItems = useMemo(() => {
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (entry) =>
        entry.translationEn.toLowerCase().includes(q) ||
        entry.transliteration.toLowerCase().includes(q) ||
        entry.titleEn.toLowerCase().includes(q) ||
        entry.arabic.includes(query.trim()),
    );
  }, [q, query]);

  const listData = q
    ? filteredItems.map((entry) => ({
        key: entry.id,
        slug: entry.chapterSlug,
        chapterNumber: entry.chapterNumber,
        title: entry.titleEn,
        subtitle: entry.translationEn,
      }))
    : chapters.map((chapter) => ({
        key: chapter.slug,
        slug: chapter.slug,
        chapterNumber: chapter.chapterNumber,
        title: getTranslation(chapter.title.translations),
        subtitle: undefined as string | undefined,
      }));

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={listData}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <ChapterRow
            slug={item.slug}
            chapterNumber={item.chapterNumber}
            title={item.title}
            subtitle={item.subtitle}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          q ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={32} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                No results for "{query.trim()}"
              </Text>
            </View>
          ) : null
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Chapters</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Hisn al-Muslim — search by keyword or browse all chapters.
            </Text>
            <SearchInput
              value={query}
              onChangeText={setQuery}
              placeholder="Sleep, protection, forgiveness, travel..."
            />
            {q ? (
              <Text style={[styles.resultCount, { color: colors.mutedForeground }]}>
                {filteredItems.length} result(s)
              </Text>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { gap: Spacing.md, paddingBottom: Spacing.md },
  title: { fontFamily: Fonts.sansBold, fontSize: 24, paddingTop: Spacing.lg },
  subtitle: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 22 },
  resultCount: { fontFamily: Fonts.sans, fontSize: 12 },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  separator: { height: Spacing.sm + 4 },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emptyText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    textAlign: "center",
  },
});
