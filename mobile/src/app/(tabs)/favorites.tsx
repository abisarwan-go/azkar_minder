import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AzkarCard } from "@/components/AzkarCard";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { getItemById } from "@/data/hisn/load";
import { useFavorites } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function FavoritesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { favs } = useFavorites();
  const items = favs
    .map((id) => getItemById(id))
    .filter((item): item is NonNullable<typeof item> => item != null);

  if (items.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Favorites</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Your saved adhkar, available offline.
          </Text>
        </View>
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.accent }]}>
            <Ionicons name="heart-outline" size={32} color={colors.mutedForeground} />
          </View>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            No favorites yet.
          </Text>
          <Pressable
            onPress={() => router.push("/chapters")}
            style={styles.emptyLink}
            hitSlop={8}
          >
            <Text style={[styles.emptyLinkText, { color: colors.primary }]}>
              Browse chapters →
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AzkarCard item={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>Favorites</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Your saved adhkar, available offline.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { gap: Spacing.sm, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  title: { fontFamily: Fonts.sansBold, fontSize: 24 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 22 },
  list: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  separator: { height: Spacing.md },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontFamily: Fonts.sans, fontSize: 14 },
  emptyLink: { minHeight: 44, justifyContent: "center" },
  emptyLinkText: { fontFamily: Fonts.sansSemiBold, fontSize: 14 },
});
