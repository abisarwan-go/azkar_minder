import { useState } from "react";
import { Heart, Share2, RotateCcw, Plus, Check, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import type { HisnItem } from "@/data/hisn/types";
import { useCounter, useFavorites, useSettings } from "@/lib/storage";
import { getTranslation } from "@/lib/translation";
import { cn } from "@/lib/utils";

const SIZE_CLASS = {
  sm: "text-arabic-sm",
  md: "text-arabic-md",
  lg: "text-arabic-lg",
  xl: "text-arabic-xl",
} as const;

function ReferenceSheet({
  open,
  onClose,
  reference,
  hisnReference,
}: {
  open: boolean;
  onClose: () => void;
  reference: string;
  hisnReference: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close source"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reference-title"
        className="relative w-full max-w-md mx-auto rounded-t-2xl bg-card border border-border shadow-lg p-5 pb-8 space-y-3 animate-in slide-in-from-bottom duration-200"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 id="reference-title" className="font-semibold text-sm">
              Source
            </h3>
            <p className="text-xs text-muted-foreground">{hisnReference}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{reference}</p>
      </div>
    </div>
  );
}

export function AzkarCard({ item }: { item: HisnItem }) {
  const { count, inc, reset, completed } = useCounter(item.id, item.repetitions);
  const { isFav, toggle } = useFavorites();
  const { settings } = useSettings();
  const [pulse, setPulse] = useState(false);
  const [referenceOpen, setReferenceOpen] = useState(false);

  const translation = getTranslation(item.text.translations);
  const reference = item.reference ?? item.hisnReference;
  const hasReference = Boolean(item.reference?.trim());

  const handleInc = () => {
    if (completed) return;
    inc();
    setPulse(true);
    setTimeout(() => setPulse(false), 300);
    if (count + 1 >= item.repetitions) {
      toast.success("بَارَكَ اللَّهُ فِيكَ", { description: "Dhikr completed" });
    }
  };

  const handleShare = async () => {
    const text = `${item.text.arabic}\n\n${translation}\n— ${reference}`;
    try {
      if (navigator.share) await navigator.share({ text, title: "Azkar Muslim" });
      else {
        await navigator.clipboard.writeText(text);
        toast("Copied to clipboard");
      }
    } catch {
      /* noop */
    }
  };

  const progress = Math.min(100, (count / item.repetitions) * 100);
  const fav = isFav(item.id);

  return (
    <article className={cn("card-azkar p-5 space-y-4", completed && "ornament-border")}>
      <div className="flex items-center justify-end gap-1">
        {hasReference && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setReferenceOpen(true)}
            aria-label="View source"
          >
            <Info className="h-4 w-4 text-primary" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => toggle(item.id)}
          aria-label="Favorite"
        >
          <Heart className={cn("h-4 w-4", fav && "fill-destructive text-destructive")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleShare}
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      <ReferenceSheet
        open={referenceOpen}
        onClose={() => setReferenceOpen(false)}
        reference={item.reference ?? ""}
        hisnReference={item.hisnReference}
      />

      <p className={cn("font-arabic text-right text-foreground", SIZE_CLASS[settings.arabicSize])}>
        {item.text.arabic}
      </p>

      {item.text.transliteration && (
        <p className="text-sm italic text-muted-foreground leading-relaxed whitespace-pre-line">
          {item.text.transliteration}
        </p>
      )}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{translation}</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium tabular-nums">
            {count} / {item.repetitions}
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleInc}
          disabled={completed}
          className={cn(
            "flex-1 h-12 text-base font-semibold rounded-xl transition-transform",
            pulse && "animate-pulse-soft",
            completed && "bg-gold text-gold-foreground hover:bg-gold",
          )}
        >
          {completed ? (
            <>
              <Check className="mr-2 h-5 w-5" /> Completed
            </>
          ) : (
            <>
              <Plus className="mr-2 h-5 w-5" /> Count
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl"
          onClick={reset}
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </article>
  );
}
