export const ARABIC_STYLES = {
  amiri: {
    id: "amiri",
    label: "Amiri",
    description: "Classic Naskh — traditional and balanced",
    fontFamily: "Amiri_400Regular",
    lineHeightRatio: 2.1,
  },
  naskh: {
    id: "naskh",
    label: "Noto Naskh",
    description: "Modern Naskh — crisp and easy to read",
    fontFamily: "NotoNaskhArabic_400Regular",
    lineHeightRatio: 2,
  },
  scheherazade: {
    id: "scheherazade",
    label: "Scheherazade",
    description: "Open and elegant — great for long dhikr",
    fontFamily: "ScheherazadeNew_400Regular",
    lineHeightRatio: 2.25,
  },
} as const;

export type ArabicStyleId = keyof typeof ARABIC_STYLES;

export const ARABIC_STYLE_OPTIONS = Object.values(ARABIC_STYLES);

export const ARABIC_STYLE_PREVIEW = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";

export function getArabicStyle(id: ArabicStyleId | undefined) {
  return ARABIC_STYLES[id ?? "amiri"];
}
