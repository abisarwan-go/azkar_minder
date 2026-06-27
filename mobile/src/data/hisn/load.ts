import type { HisnChapter, HisnChapterMeta, HisnItem } from "./types";
import { HISN_CHAPTER_INDEX } from "./chapter-index";

const chapterContext = require.context("./chapters", false, /\.json$/);

const chaptersBySlug = new Map<string, HisnChapter>();

for (const key of chapterContext.keys()) {
  const chapter = chapterContext(key) as HisnChapter;
  chaptersBySlug.set(chapter.slug, chapter);
}

export { HISN_CHAPTER_INDEX };

export function getChapter(slug: string): HisnChapter | undefined {
  return chaptersBySlug.get(slug);
}

export function getChapterMeta(slug: string): HisnChapterMeta | undefined {
  return HISN_CHAPTER_INDEX.find((c) => c.slug === slug);
}

export function getAllChapters(): HisnChapterMeta[] {
  return HISN_CHAPTER_INDEX;
}

export function getItemById(id: string): HisnItem | undefined {
  for (const chapter of chaptersBySlug.values()) {
    const item = chapter.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}
