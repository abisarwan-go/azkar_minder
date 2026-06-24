import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { HISN_ITEMS_BY_ID } from "@/data/hisn/items-by-id";
import { useFavorites } from "@/lib/storage";
import { AzkarCard } from "@/components/AzkarCard";

export const Route = createFileRoute("/_app/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Azkar Muslim" }] }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favs } = useFavorites();
  const items = favs
    .map((id) => HISN_ITEMS_BY_ID[id]?.item)
    .filter((item): item is NonNullable<typeof item> => item != null);

  return (
    <div className="px-4 space-y-4 pt-6">
      <header>
        <h1 className="text-2xl font-bold">Favorites</h1>
        <p className="text-sm text-muted-foreground">Your saved adhkar, available offline.</p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No favorites yet.</p>
          <Link to="/chapters" className="inline-block text-sm text-primary font-medium">
            Browse chapters →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <AzkarCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
