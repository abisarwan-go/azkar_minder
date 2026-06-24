import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun, Type } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Azkar Muslim" }] }),
  component: SettingsPage,
});

const SIZES = [
  { id: "sm", label: "S" },
  { id: "md", label: "M" },
  { id: "lg", label: "L" },
  { id: "xl", label: "XL" },
] as const;

function SettingsPage() {
  const { settings, setSettings } = useSettings();

  const testNotification = async () => {
    if (typeof Notification === "undefined") return toast.error("Notifications not supported");
    let perm = Notification.permission;
    if (perm === "default") perm = await Notification.requestPermission();
    if (perm !== "granted") return toast.error("Permission denied");
    new Notification("Azkar Muslim", { body: "Your reminders are ready" });
  };

  return (
    <div className="px-4 space-y-6 pt-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </header>

      <section className="card-azkar p-4 space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Sun className="h-4 w-4" /> Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Dark mode</div>
            <div className="text-xs text-muted-foreground">Easier on the eyes at night</div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch
              checked={settings.theme === "dark"}
              onCheckedChange={(v) => setSettings({ ...settings, theme: v ? "dark" : "light" })}
            />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Type className="h-4 w-4" /> Arabic text size
          </div>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSettings({ ...settings, arabicSize: s.id })}
                className={cn(
                  "h-12 rounded-xl border font-arabic transition-colors",
                  settings.arabicSize === s.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-accent",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card-azkar p-4 space-y-4">
        <h2 className="font-semibold">Daily reminders</h2>
        <p className="text-xs text-muted-foreground">
          Notifications work in the browser when the app is open.
        </p>

        <ReminderRow
          label="Morning adhkar"
          enabled={settings.reminders.morning.enabled}
          time={settings.reminders.morning.time}
          onChange={(enabled, time) =>
            setSettings({ ...settings, reminders: { ...settings.reminders, morning: { enabled, time } } })
          }
        />
        <ReminderRow
          label="Evening adhkar"
          enabled={settings.reminders.evening.enabled}
          time={settings.reminders.evening.time}
          onChange={(enabled, time) =>
            setSettings({ ...settings, reminders: { ...settings.reminders, evening: { enabled, time } } })
          }
        />
        <ReminderRow
          label="Before sleep"
          enabled={settings.reminders.sleep.enabled}
          time={settings.reminders.sleep.time}
          onChange={(enabled, time) =>
            setSettings({ ...settings, reminders: { ...settings.reminders, sleep: { enabled, time } } })
          }
        />

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <div className="text-sm font-medium">After each prayer</div>
            <div className="text-xs text-muted-foreground">Notification after the five prayers</div>
          </div>
          <Switch
            checked={settings.reminders.afterPrayer.enabled}
            onCheckedChange={(v) =>
              setSettings({
                ...settings,
                reminders: { ...settings.reminders, afterPrayer: { enabled: v } },
              })
            }
          />
        </div>

        <Button variant="outline" className="w-full rounded-xl" onClick={testNotification}>
          Test notification
        </Button>
      </section>

      <section className="card-azkar p-4 space-y-2">
        <h2 className="font-semibold">About</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Azkar Muslim brings authentic invocations from Hisn al-Muslim, the Quran, and Sahih collections.
          Sources are cited for each invocation. Data is stored locally on your device and works offline.
        </p>
      </section>
    </div>
  );
}

function ReminderRow({
  label, enabled, time, onChange,
}: { label: string; enabled: boolean; time: string; onChange: (enabled: boolean, time: string) => void }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3">
      <div className="text-sm font-medium min-w-0 truncate">{label}</div>
      <Input
        type="time"
        value={time}
        onChange={(e) => onChange(enabled, e.target.value)}
        className="h-9 w-28 rounded-lg"
      />
      <Switch checked={enabled} onCheckedChange={(v) => onChange(v, time)} />
    </div>
  );
}
