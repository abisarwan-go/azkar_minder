export type ContentLocale = "en" | "fr";

export type LocalizedText = Partial<Record<ContentLocale, string>>;

export interface HisnItem {
  id: string;
  itemNumber: number;
  hisnNumber: number;
  hisnReference: string;
  url: string;
  text: {
    arabic: string;
    transliteration?: string;
    translations: LocalizedText;
  };
  reference?: string;
  repetitions: number;
}

export interface HisnChapter {
  chapterNumber: number;
  slug: string;
  title: {
    arabic: string;
    translations: LocalizedText;
  };
  items: HisnItem[];
}

export interface HisnChapterMeta {
  chapterNumber: number;
  slug: string;
  fileName: string;
  itemCount: number;
  title: HisnChapter["title"];
}

export interface HisnItemRef {
  chapterSlug: string;
  chapterNumber?: number;
  item: HisnItem;
}

export interface HisnSearchEntry {
  id: string;
  chapterSlug: string;
  chapterNumber: number;
  titleEn: string;
  titleAr: string;
  arabic: string;
  translationEn: string;
  transliteration: string;
}
