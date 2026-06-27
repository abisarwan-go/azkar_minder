import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts, Radius, Spacing } from "@/constants/theme";
import { useThemeColors } from "@/hooks/use-theme-colors";

interface ReferenceSheetProps {
  visible: boolean;
  onClose: () => void;
  reference: string;
  hisnReference: string;
}

export function ReferenceSheet({
  visible,
  onClose,
  reference,
  hisnReference,
}: ReferenceSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close source" />
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            paddingBottom: Math.max(insets.bottom, Spacing.md),
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: colors.foreground }]}>Source</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              {hisnReference}
            </Text>
          </View>
          <Pressable
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.6 }]}
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={22} color={colors.foreground} />
          </Pressable>
        </View>
        <Text style={[styles.body, { color: colors.foreground }]}>{reference}</Text>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.md + 4,
    paddingTop: Spacing.md + 4,
    gap: Spacing.md,
    maxHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  headerText: { flex: 1, gap: 4 },
  title: { fontFamily: Fonts.sansSemiBold, fontSize: 15 },
  subtitle: { fontFamily: Fonts.sans, fontSize: 12 },
  closeButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 22,
  },
});
