# Développement

## Scripts npm

| Script | Commande | Description |
|--------|----------|-------------|
| `start` | `expo start` | Démarre Metro Bundler |
| `android` | `expo run:android` | Compile, installe et lance sur Android |
| `ios` | `expo run:ios` | Compile, installe et lance sur iOS |
| `web` | `expo start --web` | Lance la version web |
| `lint` | `expo lint` | Analyse statique du code |
| `reset-project` | `node ./scripts/reset-project.js` | Remet le template Expo à zéro |

## Development build vs Expo Go

Ce projet inclut `expo-dev-client`. Cela signifie :

- Les modules natifs personnalisés sont supportés.
- Un APK/IPA de développement doit être installé sur l'appareil ou l'émulateur.
- Expo Go ne suffit pas pour tester toutes les fonctionnalités natives.

Metro affiche `Using development build` quand le bon client est utilisé.

## Workflow recommandé

### Émulateur Android (avec VPN actif)

Le VPN perturbe souvent la détection réseau d'Expo. Utilisez **localhost** :

```bash
# Terminal unique
adb reverse tcp:8081 tcp:8081
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

Ou en **deux terminaux** :

```bash
# Terminal 1 — Metro
adb reverse tcp:8081 tcp:8081
pnpm start --localhost

# Terminal 2 — App native (sans relancer Metro)
pnpm android --no-bundler
```

### Émulateur Android (sans VPN)

```bash
adb reverse tcp:8081 tcp:8081
pnpm android
```

### Appareil physique (même Wi-Fi)

```bash
pnpm start --lan
```

Scannez le QR code ou appuyez sur `a` / `i`. L'IP affichée doit être celle du Wi-Fi (pas une IP de tethering ou VPN).

### Réseau instable (tunnel)

Si LAN et localhost échouent :

```bash
pnpm start --tunnel
```

Nécessite un compte Expo. Plus lent, mais contourne les problèmes de réseau local.

## Modes d'hôte Metro

| Flag | Usage |
|------|-------|
| `--localhost` | Émulateur + `adb reverse` |
| `--lan` | Appareil physique sur le même réseau |
| `--tunnel` | Réseau complexe (VPN, pare-feu, hotspot) |

## Modifier le code

- Les écrans vivent dans `src/app/` (file-based routing Expo Router).
- Le layout racine est `src/app/_layout.tsx`.
- L'écran d'accueil est `src/app/index.tsx`.
- L'alias `@/` pointe vers `src/` (voir `tsconfig.json`).

Hot reload est actif par défaut : sauvegardez un fichier et l'app se met à jour.

## Ajouter une dépendance Expo

Préférez toujours la version compatible avec le SDK :

```bash
pnpm expo install <package-name>
```

Exemple :

```bash
pnpm expo install expo-notifications
```

Après l'ajout d'un module natif, relancez un build :

```bash
pnpm android
# ou
pnpm ios
```

## Générer les dossiers natifs

Les dossiers `android/` et `ios/` sont déjà présents (prebuild). Si vous modifiez `app.json` (plugins, permissions, identifiants) :

```bash
pnpm expo prebuild
```

Ou pour régénérer proprement :

```bash
pnpm expo prebuild --clean
```

> `--clean` supprime et recrée `android/` et `ios/`. À utiliser avec précaution si vous avez des modifications manuelles dans ces dossiers.

## Identifiants de l'app

| Plateforme | Identifiant |
|------------|-------------|
| Android | `com.azkarminder.mobile` |
| Scheme deep link | `mobile://` |
