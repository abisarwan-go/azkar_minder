import { useState } from "react";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ReferenceSheet } from "@/components/ReferenceSheet";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import type { HisnItem } from "@/data/hisn/types";
import { useCounter, useFavorites, useArabicTextStyle, useSettings } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { getTranslation } from "@/lib/translation";

export function AzkarCard({ item }: { item: HisnItem }) {
  const colors = useThemeColors();
  const { settings } = useSettings();
  const { count, inc, reset, completed } = useCounter(item.id, item.repetitions);
  const { isFav, toggle } = useFavorites();
  const [justCompleted, setJustCompleted] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const translation = getTranslation(item.text.translations);
  const reference = item.reference ?? item.hisnReference;
  const hasReference = Boolean(item.reference?.trim());
  const progress = Math.min(100, (count / item.repetitions) * 100);
  const arabicText = useArabicTextStyle();
  const showTransliteration =
    (settings.showTransliteration ?? false) && Boolean(item.text.transliteration?.trim());
  const fav = isFav(item.id);

  const handleInc = () => {
    if (completed) return;
    inc();
    if (count + 1 >= item.repetitions) {
      setJustCompleted(true);
    }
  };

  const handleShare = async () => {
    const text = `${item.text.arabic}\n\n${translation}\n— ${reference}`;
    try {
      await Share.share({ message: text, title: "Azkar Muslim" });
    } catch {
      /* cancelled */
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: completed ? colors.gold : colors.border,
        },
        completed && styles.cardCompleted,
      ]}
    >
      <View style={styles.cardActions}>
        {hasReference ? (
          <Pressable
            onPress={() => setReferenceOpen(true)}
            accessibilityLabel="View source"
            hitSlop={8}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <Ionicons name="information-circle-outline" size={22} color={colors.primary} />
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => toggle(item.id)}
          accessibilityLabel={fav ? "Remove from favorites" : "Add to favorites"}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Ionicons
            name={fav ? "heart" : "heart-outline"}
            size={22}
            color={fav ? colors.destructive : colors.mutedForeground}
          />
        </Pressable>
        <Pressable
          onPress={handleShare}
          accessibilityLabel="Share"
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Ionicons name="share-outline" size={22} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <ReferenceSheet
        visible={referenceOpen}
        onClose={() => setReferenceOpen(false)}
        reference={item.reference ?? ""}
        hisnReference={item.hisnReference}
      />

      <Text
        style={[
          styles.arabic,
          {
            color: colors.foreground,
            fontSize: arabicText.fontSize,
            fontFamily: arabicText.fontFamily,
            lineHeight: arabicText.lineHeight,
          },
        ]}
      >
        {item.text.arabic}
      </Text>

      {showTransliteration ? (
        <Text style={[styles.transliteration, { color: colors.mutedForeground }]}>
          {item.text.transliteration}
        </Text>
      ) : null}

      <Text style={[styles.translation, { color: colors.foreground }]}>{translation}</Text>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>Progress</Text>
          <Text style={[styles.progressCount, { color: colors.mutedForeground }]}>
            {count} / {item.repetitions}
          </Text>
        </View>
        <Progress value={progress} />
      </View>

      {justCompleted && completed ? (
        <Text style={[styles.completionMessage, { color: colors.gold }]}>
          بَارَكَ اللَّهُ فِيكَ — Dhikr completed
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Button
          variant={completed ? "gold" : "primary"}
          disabled={completed}
          onPress={handleInc}
          style={styles.countButton}
        >
          <View style={styles.countButtonContent}>
            <Ionicons
              name={completed ? "checkmark" : "add"}
              size={20}
              color={completed ? colors.goldForeground : colors.primaryForeground}
            />
            <Text
              style={[
                styles.countButtonLabel,
                { color: completed ? colors.goldForeground : colors.primaryForeground },
              ]}
            >
              {completed ? "Completed" : "Count"}
            </Text>
          </View>
        </Button>

        <Button variant="outline" size="icon" onPress={reset} accessibilityLabel="Reset">
          <Ionicons name="refresh" size={18} color={colors.foreground} />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius["2xl"],
    padding: Spacing.md + 4,
    gap: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: { borderWidth: 2 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.xs,
  },
  iconButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -Spacing.sm,
  },
  iconButtonPressed: { opacity: 0.6 },
  arabic: {
    textAlign: "right",
    writingDirection: "rtl",
  },
  transliteration: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontStyle: "italic",
    lineHeight: 22,
  },
  translation: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 22,
    opacity: 0.9,
  },
  progressSection: { gap: Spacing.sm },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: { fontFamily: Fonts.sans, fontSize: 12 },
  progressCount: { fontFamily: Fonts.sansMedium, fontSize: 12 },
  completionMessage: {
    fontFamily: Fonts.sansMedium,
    fontSize: 13,
    textAlign: "center",
  },
  actions: { flexDirection: "row", gap: Spacing.sm },
  countButton: { flex: 1 },
  countButtonContent: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  countButtonLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 16 },
});
