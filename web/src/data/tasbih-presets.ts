export interface TasbihPreset {
  id: string;
  label: string;
  arabic: string;
  translation: string;
}

export const TASBIH_PRESETS: readonly TasbihPreset[] = [
  { id: "subhanallah", label: "SubhanAllah", arabic: "سُبْحَانَ اللَّهِ", translation: "Glory be to Allah" },
  { id: "alhamdulillah", label: "Alhamdulillah", arabic: "الْحَمْدُ لِلَّهِ", translation: "Praise be to Allah" },
  { id: "allahu-akbar", label: "Allahu Akbar", arabic: "اللَّهُ أَكْبَرُ", translation: "Allah is the Greatest" },
  { id: "la-ilaha", label: "La ilaha illa Allah", arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ", translation: "There is no god but Allah" },
  { id: "astaghfirullah", label: "Astaghfirullah", arabic: "أَسْتَغْفِرُ اللَّهَ", translation: "I seek forgiveness from Allah" },
];
