import type { ContentLocale, LocalizedText } from "@/data/hisn/types";

export const DEFAULT_CONTENT_LOCALE: ContentLocale = "en";

export function getTranslation(
  translations: LocalizedText,
  locale: ContentLocale = DEFAULT_CONTENT_LOCALE,
): string {
  return translations[locale] ?? translations.en ?? "";
}
