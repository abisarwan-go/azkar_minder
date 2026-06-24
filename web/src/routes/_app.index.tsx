import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles, Sun, Moon } from "lucide-react";
import { FEATURED_CHAPTERS } from "@/data/featured-chapters";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Azkar Muslim — Daily Adhkar" },
      {
        name: "description",
        content: "Authentic adhkar from Hisn al-Muslim: Arabic, transliteration, and English translation.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const Icon = hour < 18 ? Sun : Moon;

  return (
    <div className="px-4 space-y-8 pb-4">
      <header className="pt-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3.5 w-3.5 text-gold" />
          <span>{greeting}, may Allah bless you</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Azkar Muslim</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Authentic adhkar from Hisn al-Muslim — Arabic, transliteration, and English.
        </p>
      </header>

      <section className="ornament-border p-5 rounded-2xl">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-gold mt-1 shrink-0" />
          <div className="space-y-1">
            <p className="font-arabic text-arabic-sm text-right">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            <p className="text-xs text-muted-foreground">
              In the name of Allah, the Most Gracious, the Most Merciful.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base">Daily essentials</h2>
            <Link
              to="/chapters"
              className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline"
            >
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {FEATURED_CHAPTERS.map((chapter) => (
              <Link
                key={chapter.slug}
                to="/chapter/$slug"
                params={{ slug: chapter.slug }}
                className="card-azkar p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-soft transition-all group"
              >
                <div className="h-12 w-12 rounded-2xl bg-accent/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  {chapter.emoji}
                </div>
                <div className="space-y-0.5">
                  <div className="font-semibold text-sm leading-snug">{chapter.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{chapter.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/tasbih"
            className="card-azkar p-4 bg-primary text-primary-foreground border-transparent hover:opacity-95 transition-opacity"
          >
            <div className="text-2xl mb-2">📿</div>
            <div className="font-semibold">Tasbih</div>
            <div className="text-xs opacity-80 mt-0.5">Digital counter</div>
          </Link>
          <Link
            to="/favorites"
            className="card-azkar p-4 bg-gold text-gold-foreground border-transparent hover:opacity-95 transition-opacity"
          >
            <div className="text-2xl mb-2">⭐</div>
            <div className="font-semibold">Favorites</div>
            <div className="text-xs opacity-80 mt-0.5">Saved adhkar</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
