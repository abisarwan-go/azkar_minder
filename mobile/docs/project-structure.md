# Structure du projet

## Arborescence

```
mobile/
├── android/              # Projet Android natif (Gradle)
├── ios/                  # Projet iOS natif (Xcode) — macOS uniquement
├── assets/               # Images, icônes, splash screen
│   ├── images/
│   └── expo.icon/
├── src/
│   └── app/              # Routes Expo Router (file-based)
│       ├── _layout.tsx   # Layout racine (Stack)
│       └── index.tsx     # Écran d'accueil (/)
├── docs/                 # Documentation du projet
├── app.json              # Configuration Expo
├── package.json
├── tsconfig.json
├── expo-env.d.ts         # Types Expo (généré, gitignored)
└── .expo/                # Cache local Expo (gitignored)
```

## Routing (Expo Router)

Le routing est basé sur les fichiers dans `src/app/`.

| Fichier | Route |
|---------|-------|
| `src/app/index.tsx` | `/` |
| `src/app/about.tsx` | `/about` |
| `src/app/settings/index.tsx` | `/settings` |
| `src/app/(tabs)/_layout.tsx` | Groupe de routes à onglets |

### Layout racine

`src/app/_layout.tsx` définit la navigation globale. Actuellement un `Stack` simple :

```tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
```

### Ajouter un écran

Créez un fichier dans `src/app/` :

```tsx
// src/app/profile.tsx
import { Text, View } from "react-native";

export default function Profile() {
  return (
    <View>
      <Text>Profil</Text>
    </View>
  );
}
```

Route accessible à `/profile`.

## Alias TypeScript

Configurés dans `tsconfig.json` :

| Alias | Chemin |
|-------|--------|
| `@/*` | `./src/*` |
| `@/assets/*` | `./assets/*` |

Exemple :

```tsx
import { useColorScheme } from "@/hooks/use-color-scheme";
```

## Conventions

- **Langage** : TypeScript strict
- **Composants** : fonctions React nommées, export par défaut pour les écrans
- **Styles** : `StyleSheet.create` ou solutions futures (NativeWind, etc.)
- **Routing** : exclusivement via Expo Router, pas de React Navigation manuel
- **Modules natifs** : installer via `pnpm expo install`

## Fonctionnalités activées

Définies dans `app.json` → `experiments` :

| Option | Effet |
|--------|-------|
| `typedRoutes: true` | Routes typées (`.expo/types/router.d.ts`) |
| `reactCompiler: true` | React Compiler activé |

## Dossiers gitignored importants

| Dossier / fichier | Raison |
|-------------------|--------|
| `.expo/` | Cache machine locale, sessions dev |
| `node_modules/` | Dépendances |
| `expo-env.d.ts` | Généré par Expo |
| `android/app/build/` | Artefacts de build Android |

Ne commitez pas `.expo/` ni les builds natifs.

## Relation avec le monorepo

Ce dossier `mobile/` fait partie du dépôt **azkar_minder**. La partie web vit dans `web/` (TanStack Start). Les deux apps sont indépendantes au niveau des dépendances et du build.
