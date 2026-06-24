import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HISN_CHAPTER_INDEX } from "@/data/hisn/load";
import searchIndex from "@/data/hisn/search-index.json";
import type { HisnSearchEntry } from "@/data/hisn/types";
import { getTranslation } from "@/lib/translation";

const SEARCH_INDEX = searchIndex as HisnSearchEntry[];

function ChapterNumber({ n }: { n: number }) {
  return (
    <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-accent px-1.5 text-xs font-semibold text-primary tabular-nums shrink-0">
      {n}
    </span>
  );
}

export const Route = createFileRoute("/_app/chapters")({
  head: () => ({ meta: [{ title: "Chapters — Azkar Muslim" }] }),
  component: ChaptersPage,
});

function ChaptersPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filteredItems = q
    ? SEARCH_INDEX.filter(
        (entry) =>
          entry.translationEn.toLowerCase().includes(q) ||
          entry.transliteration.toLowerCase().includes(q) ||
          entry.titleEn.toLowerCase().includes(q) ||
          entry.arabic.includes(query),
      )
    : [];

  return (
    <div className="px-4 space-y-5 pt-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Chapters</h1>
        <p className="text-sm text-muted-foreground">
          Hisn al-Muslim — search by keyword or browse all chapters.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Sleep, protection, forgiveness, travel..."
          className="pl-9 h-11 rounded-xl bg-card"
        />
      </div>

      {q ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{filteredItems.length} result(s)</p>
          {filteredItems.map((entry) => (
            <Link
              key={entry.id}
              to="/chapter/$slug"
              params={{ slug: entry.chapterSlug }}
              className="card-azkar px-4 py-3 flex items-center gap-3"
            >
              <ChapterNumber n={entry.chapterNumber} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{entry.titleEn}</p>
                <p className="text-xs text-muted-foreground truncate">{entry.translationEn}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2 pb-4">
          {HISN_CHAPTER_INDEX.map((chapter) => (
            <Link
              key={chapter.slug}
              to="/chapter/$slug"
              params={{ slug: chapter.slug }}
              className="card-azkar px-4 py-3 flex items-center gap-3 group hover:border-primary/20 transition-colors"
            >
              <ChapterNumber n={chapter.chapterNumber} />
              <span className="min-w-0 flex-1 text-sm font-medium truncate">
                {getTranslation(chapter.title.translations)}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
