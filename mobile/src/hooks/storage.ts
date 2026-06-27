import { createContext, createElement, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getArabicStyle, type ArabicStyleId } from "@/constants/arabic-styles";
import { ArabicSizes } from "@/constants/theme";

const memoryStore = new Map<string, string>();

type AsyncStorageModule = typeof import("@react-native-async-storage/async-storage").default;

let asyncStorage: AsyncStorageModule | null = null;
let storageMode: "native" | "memory" | null = null;

async function getAsyncStorage(): Promise<AsyncStorageModule | null> {
  if (storageMode === "memory") return null;
  if (asyncStorage) return asyncStorage;

  try {
    const mod = await import("@react-native-async-storage/async-storage");
    await mod.default.getItem("__azkar_storage_probe__");
    asyncStorage = mod.default;
    storageMode = "native";
    return asyncStorage;
  } catch {
    storageMode = "memory";
    if (__DEV__) {
      console.warn(
        "[storage] AsyncStorage native module unavailable — using in-memory fallback. " +
          "Rebuild the dev client: pnpm expo run:android",
      );
    }
    return null;
  }
}

async function readItem(key: string): Promise<string | null> {
  const storage = await getAsyncStorage();
  if (!storage) return memoryStore.get(key) ?? null;
  return storage.getItem(key);
}

async function writeItem(key: string, value: string): Promise<void> {
  const storage = await getAsyncStorage();
  if (!storage) {
    memoryStore.set(key, value);
    return;
  }
  await storage.setItem(key, value);
}

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await readItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function triggerHaptic() {
  try {
    const Haptics = await import("expo-haptics");
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Native module missing until dev client rebuild
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    read(key, initial).then((stored) => {
      setValue(stored);
      setHydrated(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    writeItem(key, JSON.stringify(value)).catch(() => {});
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

export function useCounter(id: string, target: number) {
  const [counts, setCounts] = useLocalStorage<Record<string, number>>("azkar.counts", {});
  const count = counts[id] ?? 0;

  const inc = useCallback(() => {
    setCounts((prev) => {
      const next = (prev[id] ?? 0) + 1;
      return { ...prev, [id]: next > target ? target : next };
    });
    triggerHaptic();
  }, [id, setCounts, target]);

  const reset = useCallback(() => {
    setCounts((prev) => ({ ...prev, [id]: 0 }));
  }, [id, setCounts]);

  return { count, inc, reset, completed: count >= target };
}

export function useFavorites() {
  const [favs, setFavs] = useLocalStorage<string[]>("azkar.favorites", []);
  const isFav = useCallback((id: string) => favs.includes(id), [favs]);
  const toggle = useCallback(
    (id: string) => {
      setFavs((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
      triggerHaptic();
    },
    [setFavs],
  );
  return { favs, isFav, toggle };
}

export interface AppSettings {
  theme: "system" | "light" | "dark";
  arabicStyle: "amiri" | "naskh" | "scheherazade";
  arabicSize: "sm" | "md" | "lg" | "xl";
  showTransliteration: boolean;
  reminders: {
    morning: { enabled: boolean; time: string };
    evening: { enabled: boolean; time: string };
    sleep: { enabled: boolean; time: string };
    afterPrayer: { enabled: boolean };
  };
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: "system",
  arabicStyle: "amiri",
  arabicSize: "md",
  showTransliteration: false,
  reminders: {
    morning: { enabled: false, time: "06:30" },
    evening: { enabled: false, time: "17:30" },
    sleep: { enabled: false, time: "22:30" },
    afterPrayer: { enabled: false },
  },
};

interface SettingsContextValue {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AppSettings>(
    "azkar.settings",
    DEFAULT_SETTINGS,
  );

  return createElement(
    SettingsContext.Provider,
    { value: { settings, setSettings } },
    children,
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

export function useArabicTextStyle(overrideFontSize?: number) {
  const { settings } = useSettings();
  const styleId = (settings.arabicStyle ?? DEFAULT_SETTINGS.arabicStyle) as ArabicStyleId;
  const style = getArabicStyle(styleId);
  const fontSize = overrideFontSize ?? ArabicSizes[settings.arabicSize];

  return {
    fontFamily: style.fontFamily,
    fontSize,
    lineHeight: Math.round(fontSize * style.lineHeightRatio),
  };
}
