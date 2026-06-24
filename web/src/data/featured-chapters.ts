export interface FeaturedChapter {
  slug: string;
  emoji: string;
  label: string;
  subtitle: string;
}

/** Six most-used daily adhkar — shown on the home page. Full list at /chapters. */
export const FEATURED_CHAPTERS: FeaturedChapter[] = [
  {
    slug: "in-the-morning-and-evening",
    emoji: "🌅",
    label: "Morning & Evening",
    subtitle: "After Fajr and Asr",
  },
  {
    slug: "when-waking-up",
    emoji: "☀️",
    label: "Wake up",
    subtitle: "Upon rising from sleep",
  },
  {
    slug: "before-sleeping",
    emoji: "🌙",
    label: "Before sleep",
    subtitle: "Night adhkar & protection",
  },
  {
    slug: "after-salam",
    emoji: "🕌",
    label: "After prayer",
    subtitle: "Dhikr following salah",
  },
  {
    slug: "upon-completing-the-ablution",
    emoji: "💧",
    label: "After wudu",
    subtitle: "Following ablution",
  },
  {
    slug: "before-eating",
    emoji: "🍽️",
    label: "Before eating",
    subtitle: "Mealtime remembrance",
  },
];
