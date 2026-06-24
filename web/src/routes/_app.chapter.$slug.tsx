import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { getChapterBySlug, getChapterMeta } from "@/data/hisn/load";
import { AzkarCard } from "@/components/AzkarCard";
import { getTranslation } from "@/lib/translation";

export const Route = createFileRoute("/_app/chapter/$slug")({
  loader: ({ params }) => {
    const meta = getChapterMeta(params.slug);
    const chapter = getChapterBySlug(params.slug);
    if (!meta || !chapter) throw notFound();
    return { meta, chapter };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          {
            title: `${getTranslation(loaderData.meta.title.translations)} — Azkar Muslim`,
          },
          {
            name: "description",
            content: getTranslation(loaderData.meta.title.translations),
          },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="px-4 py-10 text-center">
      <p className="text-muted-foreground">Chapter not found.</p>
      <Link to="/chapters" className="text-primary text-sm mt-3 inline-block">
        Back to chapters
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="px-4 py-10 text-center space-y-3">
      <p className="text-sm text-muted-foreground">Error: {error.message}</p>
      <button type="button" className="text-primary text-sm" onClick={reset}>
        Retry
      </button>
    </div>
  ),
  component: ChapterPage,
});

function ChapterPage() {
  const { meta, chapter } = Route.useLoaderData();
  const title = getTranslation(meta.title.translations);

  return (
    <div className="px-4 space-y-4 pt-4">
      <Link
        to="/chapters"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Chapters
      </Link>
      <header className="space-y-0.5">
        <p className="text-xs text-muted-foreground tabular-nums">Chapter {meta.chapterNumber}</p>
        <h1 className="text-xl font-bold">{title}</h1>
      </header>

      <div className="space-y-3">
        {chapter.items.map((item) => (
          <AzkarCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
