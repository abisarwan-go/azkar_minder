import type { HisnChapter, HisnChapterMeta } from "./types";
import { HISN_CHAPTER_INDEX } from "./chapter-index";

const chapterModules = import.meta.glob<HisnChapter>("./chapters/*.json", {
  eager: true,
  import: "default",
});

const chaptersBySlug = new Map<string, HisnChapter>();
const chaptersByNumber = new Map<number, HisnChapter>();

for (const chapter of Object.values(chapterModules)) {
  chaptersBySlug.set(chapter.slug, chapter);
  chaptersByNumber.set(chapter.chapterNumber, chapter);
}

export { HISN_CHAPTER_INDEX };

export function getChapterBySlug(slug: string): HisnChapter | undefined {
  return chaptersBySlug.get(slug);
}

export function getChapterMeta(slug: string): HisnChapterMeta | undefined {
  return HISN_CHAPTER_INDEX.find((c) => c.slug === slug);
}

export function getAllChapters(): HisnChapterMeta[] {
  return HISN_CHAPTER_INDEX;
}
