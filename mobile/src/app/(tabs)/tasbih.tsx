import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { ArabicSizes, Fonts, Radius, Spacing } from "@/constants/theme";
import { TASBIH_PRESETS, type TasbihPreset } from "@/data/tasbih-presets";
import { useArabicTextStyle } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";

const GRID_GAP = Spacing.md - 4;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}

export default function TasbihScreen() {
  const colors = useThemeColors();
  const counterArabic = useArabicTextStyle(ArabicSizes.lg);
  const presetArabic = useArabicTextStyle(16);
  const { width } = useWindowDimensions();
  const cardWidth = Math.floor((width - Spacing.md * 2 - GRID_GAP) / 2);

  const [selected, setSelected] = useState<TasbihPreset>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [pulse, setPulse] = useState(false);

  const inc = () => {
    setCount((c) => c + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
    import("expo-haptics")
      .then((Haptics) => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))
      .catch(() => {});
  };

  const reset = () => setCount(0);

  const presetRows = chunk([...TASBIH_PRESETS], 2);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Tasbih</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Digital dhikr counter
          </Text>
        </View>

        <View
          style={[
            styles.counterCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.gold,
            },
          ]}
        >
          <Text
            style={[
              styles.counterArabic,
              {
                color: colors.primary,
                fontFamily: counterArabic.fontFamily,
                fontSize: counterArabic.fontSize,
                lineHeight: counterArabic.lineHeight,
              },
            ]}
          >
            {selected.arabic}
          </Text>
          <Text style={[styles.counterTranslation, { color: colors.mutedForeground }]}>
            {selected.translation}
          </Text>
          <Text
            style={[
              styles.counterValue,
              { color: colors.foreground },
              pulse && styles.counterPulse,
            ]}
          >
            {count}
          </Text>
          <View style={styles.counterActions}>
            <Button onPress={inc} style={styles.countButton}>
              <View style={styles.countButtonInner}>
                <Ionicons name="add" size={22} color={colors.primaryForeground} />
                <Text style={[styles.countButtonLabel, { color: colors.primaryForeground }]}>
                  Count
                </Text>
              </View>
            </Button>
            <Button variant="outline" size="icon" onPress={reset} accessibilityLabel="Reset">
              <Ionicons name="refresh" size={20} color={colors.foreground} />
            </Button>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Presets</Text>
          <View style={styles.grid}>
            {presetRows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.gridRow, { gap: GRID_GAP }]}>
                {row.map((preset) => {
                  const active = selected.id === preset.id;
                  return (
                    <View key={preset.id} style={{ width: cardWidth }}>
                      <Pressable
                        onPress={() => {
                          setSelected(preset);
                          setCount(0);
                        }}
                        style={[
                          styles.presetCard,
                          {
                            backgroundColor: active ? colors.accent : colors.card,
                            borderColor: active ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.presetArabic,
                            {
                              color: colors.foreground,
                              fontFamily: presetArabic.fontFamily,
                              lineHeight: presetArabic.lineHeight,
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {preset.arabic}
                        </Text>
                        <Text
                          style={[styles.presetLabel, { color: colors.mutedForeground }]}
                          numberOfLines={1}
                        >
                          {preset.label}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
                {row.length < 2 ? <View style={{ width: cardWidth }} /> : null}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.lg,
  },
  header: { paddingTop: Spacing.lg, gap: Spacing.xs },
  title: { fontFamily: Fonts.sansBold, fontSize: 24 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 14 },
  counterCard: {
    borderWidth: 2,
    borderRadius: Radius["2xl"],
    padding: Spacing.lg,
    alignItems: "center",
    gap: Spacing.md,
  },
  counterArabic: { textAlign: "center", writingDirection: "rtl" },
  counterTranslation: { fontFamily: Fonts.sans, fontSize: 14, textAlign: "center" },
  counterValue: {
    fontFamily: Fonts.sansBold,
    fontSize: 64,
    lineHeight: 72,
  },
  counterPulse: { transform: [{ scale: 1.05 }] },
  counterActions: { flexDirection: "row", gap: Spacing.sm, width: "100%" },
  countButton: { flex: 1, height: 56 },
  countButtonInner: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  countButtonLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 17 },
  section: { gap: Spacing.sm + 4 },
  sectionTitle: { fontFamily: Fonts.sansSemiBold, fontSize: 13 },
  grid: { gap: GRID_GAP },
  gridRow: { flexDirection: "row", width: "100%" },
  presetCard: {
    width: "100%",
    padding: Spacing.md - 4,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
    minHeight: 72,
  },
  presetArabic: { fontSize: 16, textAlign: "right", writingDirection: "rtl" },
  presetLabel: { fontFamily: Fonts.sans, fontSize: 11 },
});
