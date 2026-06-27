# Démarrage rapide

## Prérequis

Installez les outils suivants avant de commencer :


| Outil                                                  | Usage                               |
| ------------------------------------------------------ | ----------------------------------- |
| [Node.js](https://nodejs.org/)                         | LTS recommandé (v20+)               |
| [pnpm](https://pnpm.io/)                               | Gestionnaire de paquets du projet   |
| [Android Studio](https://developer.android.com/studio) | Émulateur Android + SDK             |
| Xcode (macOS uniquement)                               | Simulateur iOS                      |
| [Watchman](https://facebook.github.io/watchman/)       | Optionnel, améliore Metro sur macOS |


### Variables d'environnement Android

Assurez-vous que `ANDROID_HOME` est configuré et que `platform-tools` est dans le `PATH` :

```bash
# Exemple ~/.zshrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Vérifiez :

```bash
adb --version
```

## Installation

Depuis la racine du dossier `mobile/` :

```bash
pnpm install
```

## Premier lancement

Ce projet utilise un **development build** (`expo-dev-client`), pas Expo Go. La première fois, un build natif est nécessaire.

### Android (émulateur)

**Option A — un seul terminal** (build + Metro en une commande) :

```bash
adb reverse tcp:8081 tcp:8081
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

**Option B — deux terminaux** (recommandé au quotidien, Metro séparé du build natif) :

```bash
# Terminal 1
adb reverse tcp:8081 tcp:8081
pnpm start --localhost

# Terminal 2
pnpm android --no-bundler
```

> Voir [Réseau Android & VPN](./android-networking.md) pour les détails et le contexte VPN.

### Android (appareil physique)

1. Activez le **mode développeur** et le **débogage USB** sur le téléphone.
2. Connectez-le en USB ou assurez-vous qu'il est sur le **même réseau Wi-Fi** que le Mac.
3. Lancez :

```bash
pnpm android
```

### iOS (simulateur, macOS uniquement)

```bash
pnpm ios
```

### Web

```bash
pnpm web
```

Ouvre l'app dans le navigateur via Metro (`http://localhost:8081`).

## Après le premier build

Les builds suivants sont beaucoup plus rapides. Pour le développement quotidien sur **émulateur** :

```bash
# Terminal 1
adb reverse tcp:8081 tcp:8081
pnpm start --localhost

# Terminal 2
pnpm android --no-bundler
```

Sur **iOS** ou sans contrainte réseau, un seul terminal suffit :

```bash
pnpm start
```

Puis appuyez sur `a` (Android) ou `i` (iOS) dans le terminal Metro.

## Raccourcis Metro


| Touche | Action                               |
| ------ | ------------------------------------ |
| `a`    | Ouvrir sur Android                   |
| `i`    | Ouvrir sur iOS                       |
| `w`    | Ouvrir sur le web                    |
| `r`    | Recharger l'app                      |
| `m`    | Menu développeur                     |
| `j`    | Ouvrir le debugger                   |
| `s`    | Basculer Expo Go ↔ development build |
| `?`    | Afficher toutes les commandes        |


