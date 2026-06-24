import { useEffect, useState, useCallback } from "react";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setValue(read(key, initial));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch { /* noop */ }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export function useFavorites() {
  const [favs, setFavs] = useLocalStorage<string[]>("azkar.favorites", []);
  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  const toggle = useCallback((id: string) => {
    setFavs((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }, [setFavs]);
  return { favs, isFav, toggle };
}

export function useCounter(id: string, target: number) {
  const [counts, setCounts] = useLocalStorage<Record<string, number>>("azkar.counts", {});
  const count = counts[id] ?? 0;
  const inc = useCallback(() => {
    setCounts((prev) => {
      const next = (prev[id] ?? 0) + 1;
      return { ...prev, [id]: next > target ? target : next };
    });
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(15);
  }, [id, setCounts, target]);
  const reset = useCallback(() => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  }, [id, setCounts]);
  return { count, inc, reset, completed: count >= target };
}

export interface AppSettings {
  theme: "light" | "dark";
  arabicSize: "sm" | "md" | "lg" | "xl";
  reminders: {
    morning: { enabled: boolean; time: string };
    evening: { enabled: boolean; time: string };
    sleep: { enabled: boolean; time: string };
    afterPrayer: { enabled: boolean };
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  arabicSize: "md",
  reminders: {
    morning: { enabled: false, time: "06:30" },
    evening: { enabled: false, time: "17:30" },
    sleep: { enabled: false, time: "22:30" },
    afterPrayer: { enabled: false },
  },
};

export function useSettings() {
  const [settings, setSettings, hydrated] = useLocalStorage<AppSettings>("azkar.settings", DEFAULT_SETTINGS);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme, hydrated]);

  return { settings, setSettings };
}
