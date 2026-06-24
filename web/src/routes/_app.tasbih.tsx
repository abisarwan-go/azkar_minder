import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RotateCcw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TASBIH_PRESETS, type TasbihPreset } from "@/data/tasbih-presets";
import { useLocalStorage } from "@/lib/storage";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tasbih")({
  head: () => ({ meta: [{ title: "Tasbih — Digital Counter" }] }),
  component: TasbihPage,
});

interface Session { id: string; label: string; count: number; date: string; }

function TasbihPage() {
  const [selected, setSelected] = useState<TasbihPreset>(TASBIH_PRESETS[0]);
  const [count, setCount] = useState(0);
  const [custom, setCustom] = useState("");
  const [history, setHistory] = useLocalStorage<Session[]>("azkar.tasbih.history", []);
  const [pulse, setPulse] = useState(false);

  const inc = () => {
    setCount((c) => c + 1);
    setPulse(true);
    setTimeout(() => setPulse(false), 200);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
  };

  const reset = () => {
    if (count > 0) {
      setHistory((prev) => [
        { id: crypto.randomUUID(), label: selected.label, count, date: new Date().toISOString() },
        ...prev.slice(0, 9),
      ]);
    }
    setCount(0);
  };

  const useCustom = () => {
    if (!custom.trim()) return;
    setSelected({ id: "custom", label: custom.trim(), arabic: custom.trim(), translation: "Custom dhikr" });
    setCount(0);
  };

  return (
    <div className="px-4 space-y-5 pt-6">
      <header>
        <h1 className="text-2xl font-bold">Tasbih</h1>
        <p className="text-sm text-muted-foreground">Digital dhikr counter</p>
      </header>

      <div className="ornament-border rounded-3xl p-8 text-center space-y-4">
        <p className="font-arabic text-arabic-lg text-primary">{selected.arabic}</p>
        <p className="text-sm text-muted-foreground">{selected.translation}</p>
        <div className={cn("text-7xl font-bold tabular-nums transition-transform", pulse && "animate-pulse-soft")}>
          {count}
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={inc} size="lg" className="h-16 px-10 text-lg rounded-2xl shadow-soft">
            <Plus className="mr-2 h-5 w-5" /> Count
          </Button>
          <Button onClick={reset} size="lg" variant="outline" className="h-16 w-16 rounded-2xl">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Presets</h2>
        <div className="grid grid-cols-2 gap-2">
          {TASBIH_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelected(p); setCount(0); }}
              className={cn(
                "card-azkar p-3 text-left transition-colors",
                selected.id === p.id && "border-primary bg-accent/50",
              )}
            >
              <div className="font-arabic text-base">{p.arabic}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{p.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground">Custom dhikr</h2>
        <div className="flex gap-2">
          <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Enter your dhikr..." className="rounded-xl" />
          <Button onClick={useCustom} variant="secondary" className="rounded-xl">Use</Button>
        </div>
      </section>

      {history.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground">History</h2>
          <div className="space-y-1.5">
            {history.map((s) => (
              <div key={s.id} className="card-azkar p-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleString("en-US")}</div>
                </div>
                <div className="text-lg font-bold text-primary tabular-nums">{s.count}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
