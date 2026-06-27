import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import {
  ARABIC_STYLE_OPTIONS,
  ARABIC_STYLE_PREVIEW,
  type ArabicStyleId,
} from "@/constants/arabic-styles";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import type { AppSettings } from "@/hooks/storage";
import { DEFAULT_SETTINGS, useSettings } from "@/hooks/storage";
import { useThemeColors } from "@/hooks/use-theme-colors";

const THEMES = [
  { id: "system", label: "Auto" },
  { id: "light", label: "Light" },
  { id: "dark", label: "Dark" },
] as const;

const SIZES = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "xl", label: "XL" },
] as const;

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { settings, setSettings } = useSettings();

  const setTheme = (theme: AppSettings["theme"]) => {
    setSettings({ ...settings, theme });
  };

  const setArabicStyle = (arabicStyle: ArabicStyleId) => {
    setSettings({ ...settings, arabicStyle });
  };

  const setArabicSize = (size: AppSettings["arabicSize"]) => {
    setSettings({ ...settings, arabicSize: size });
  };

  const resetAppearance = () => {
    setSettings({
      ...settings,
      theme: DEFAULT_SETTINGS.theme,
      arabicStyle: DEFAULT_SETTINGS.arabicStyle,
      arabicSize: DEFAULT_SETTINGS.arabicSize,
      showTransliteration: DEFAULT_SETTINGS.showTransliteration,
    });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Customize your experience
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardTitleRow}>
            <Ionicons name="sunny-outline" size={18} color={colors.foreground} />
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Appearance</Text>
          </View>

          <View style={styles.optionSection}>
            <Text style={[styles.optionLabel, { color: colors.foreground }]}>Theme</Text>
            <Text style={[styles.optionHint, { color: colors.mutedForeground }]}>
              Auto follows your device setting
            </Text>
            <View style={styles.segmentRow}>
              {THEMES.map((theme) => {
                const active = settings.theme === theme.id;
                return (
                  <Button
                    key={theme.id}
                    variant={active ? "primary" : "outline"}
                    onPress={() => setTheme(theme.id)}
                    style={styles.segmentButton}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        { color: active ? colors.primaryForeground : colors.foreground },
                      ]}
                    >
                      {theme.label}
                    </Text>
                  </Button>
                );
              })}
            </View>
          </View>

          <View style={styles.optionSection}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="language-outline" size={18} color={colors.foreground} />
              <Text style={[styles.optionLabel, { color: colors.foreground }]}>
                Arabic style
              </Text>
            </View>
            <Text style={[styles.optionHint, { color: colors.mutedForeground }]}>
              Choose the font used for dhikr text
            </Text>
            <View style={styles.styleList}>
              {ARABIC_STYLE_OPTIONS.map((style) => {
                const active =
                  (settings.arabicStyle ?? DEFAULT_SETTINGS.arabicStyle) === style.id;
                const previewSize = 22;
                const previewLineHeight = Math.round(previewSize * style.lineHeightRatio);

                return (
                  <Pressable
                    key={style.id}
                    onPress={() => setArabicStyle(style.id)}
                    style={[
                      styles.styleCard,
                      {
                        backgroundColor: active ? colors.accent : colors.background,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <View style={styles.styleCardHeader}>
                      <Text style={[styles.styleLabel, { color: colors.foreground }]}>
                        {style.label}
                      </Text>
                      {active ? (
                        <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                      ) : null}
                    </View>
                    <Text style={[styles.styleHint, { color: colors.mutedForeground }]}>
                      {style.description}
                    </Text>
                    <Text
                      style={{
                        fontFamily: style.fontFamily,
                        fontSize: previewSize,
                        lineHeight: previewLineHeight,
                        color: colors.foreground,
                        textAlign: "right",
                        writingDirection: "rtl",
                      }}
                    >
                      {ARABIC_STYLE_PREVIEW}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.optionSection}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="text-outline" size={18} color={colors.foreground} />
              <Text style={[styles.optionLabel, { color: colors.foreground }]}>
                Arabic text size
              </Text>
            </View>
            <View style={styles.segmentRow}>
              {SIZES.map((size) => {
                const active = settings.arabicSize === size.id;
                return (
                  <Button
                    key={size.id}
                    variant={active ? "primary" : "outline"}
                    onPress={() => setArabicSize(size.id)}
                    style={styles.segmentButton}
                  >
                    <Text
                      style={[
                        styles.segmentLabel,
                        { color: active ? colors.primaryForeground : colors.foreground },
                      ]}
                    >
                      {size.label}
                    </Text>
                  </Button>
                );
              })}
            </View>
          </View>

          <View style={[styles.toggleRow, { borderTopColor: colors.border }]}>
            <View style={styles.toggleText}>
              <Text style={[styles.optionLabel, { color: colors.foreground }]}>
                Show transliteration
              </Text>
              <Text style={[styles.optionHint, { color: colors.mutedForeground }]}>
                Latin pronunciation under the Arabic text
              </Text>
            </View>
            <Switch
              value={settings.showTransliteration ?? false}
              onValueChange={(showTransliteration) =>
                setSettings({ ...settings, showTransliteration })
              }
              accessibilityLabel="Show transliteration"
            />
          </View>

          <Button variant="outline" onPress={resetAppearance} style={styles.resetButton}>
            <Text style={[styles.resetLabel, { color: colors.foreground }]}>
              Reset appearance
            </Text>
          </Button>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.about, { color: colors.mutedForeground }]}>
            Azkar Muslim brings authentic invocations from Hisn al-Muslim, the Quran, and Sahih
            collections. Sources are cited for each invocation. All data is stored locally on your
            device and works offline.
          </Text>
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
  card: {
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: Spacing.sm },
  cardTitle: { fontFamily: Fonts.sansSemiBold, fontSize: 15 },
  optionSection: { gap: Spacing.sm },
  optionLabel: { fontFamily: Fonts.sansMedium, fontSize: 14 },
  optionHint: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  styleList: { gap: Spacing.sm },
  styleCard: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md - 4,
    gap: Spacing.xs,
  },
  styleCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  styleLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 14 },
  styleHint: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
  segmentRow: { flexDirection: "row", gap: Spacing.sm },
  segmentButton: { flex: 1, height: 44 },
  segmentLabel: { fontFamily: Fonts.sansSemiBold, fontSize: 14 },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  toggleText: { flex: 1, gap: 2 },
  resetButton: { width: "100%" },
  resetLabel: { fontFamily: Fonts.sansMedium, fontSize: 14 },
  about: { fontFamily: Fonts.sans, fontSize: 12, lineHeight: 18 },
});
