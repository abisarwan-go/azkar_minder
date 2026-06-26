# Configuration

## app.json

Fichier principal de configuration Expo. Extraits importants :

### Identité de l'app

| Champ | Valeur |
|-------|--------|
| `name` | mobile |
| `slug` | mobile |
| `version` | 1.0.0 |
| `scheme` | `mobile` (deep links : `mobile://`) |

### Android

```json
{
  "android": {
    "package": "com.azkarminder.mobile",
    "predictiveBackGestureEnabled": false
  }
}
```

- **package** : identifiant unique sur le Play Store et pour `adb`
- Modifier le package nécessite un `expo prebuild` et une réinstallation de l'app

### iOS

```json
{
  "ios": {
    "icon": "./assets/expo.icon"
  }
}
```

Le bundle identifier iOS est généré à partir du slug/package lors du prebuild.

### Plugins

| Plugin | Rôle |
|--------|------|
| `expo-router` | File-based routing |
| `expo-splash-screen` | Écran de démarrage (fond `#208AEF`) |

### UI

- `userInterfaceStyle: "automatic"` — suit le thème système (clair / sombre)
- `orientation: "portrait"` — mode portrait uniquement

## TypeScript (tsconfig.json)

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/assets/*": ["./assets/*"]
    }
  }
}
```

`strict: true` — pas de `any` implicite, vérifications strictes activées.

## Variables d'environnement

Le projet n'utilise pas encore de fichier `.env`. Pour en ajouter un :

1. Créer `.env` à la racine de `mobile/`
2. Préfixer les variables exposées au client avec `EXPO_PUBLIC_`

```bash
# .env
EXPO_PUBLIC_API_URL=https://api.example.com
```

```tsx
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

> Ne jamais committer de secrets. `.env*.local` est dans `.gitignore`.

### Variable utile au développement

| Variable | Usage |
|----------|-------|
| `REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1` | Force l'IP Metro pour l'émulateur |

## Configuration Metro locale (.expo/)

Expo crée `.expo/settings.json` au premier `expo start`. Ce fichier mémorise le mode d'hôte (`lan`, `localhost`, `tunnel`). Il est spécifique à votre machine et ne doit pas être commité.

## Assets

| Fichier | Usage |
|---------|-------|
| `assets/images/icon.png` | Icône de l'app |
| `assets/images/splash-icon.png` | Splash Android |
| `assets/images/android-icon-*.png` | Icône adaptive Android |
| `assets/images/favicon.png` | Favicon web |

Après modification des icônes, relancez un build natif si nécessaire.

## Documentation officielle de référence

Avant d'écrire du code Expo, consultez la doc versionnée :

**https://docs.expo.dev/versions/v56.0.0/**

Expo évolue vite ; les APIs changent entre les versions majeures.
