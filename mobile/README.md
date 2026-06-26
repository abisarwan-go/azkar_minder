# Azkar Minder — Mobile

Application mobile Azkar Minder, construite avec **Expo SDK 56**, **Expo Router** et **React Native 0.85**.

## Démarrage rapide

**Un terminal** (premier build ou tout-en-un) :

```bash
pnpm install
adb reverse tcp:8081 tcp:8081
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

**Deux terminaux** (quotidien, émulateur) :

```bash
# Terminal 1
adb reverse tcp:8081 tcp:8081
pnpm start --localhost

# Terminal 2
pnpm android --no-bundler
```

## Documentation

Toute la documentation du projet est dans le dossier **[`docs/`](./docs/)** :

- [Sommaire](./docs/README.md)
- [Démarrage rapide](./docs/getting-started.md)
- [Développement](./docs/development.md)
- [Réseau Android & VPN](./docs/android-networking.md) — indispensable si vous utilisez un VPN ou un émulateur
- [Structure du projet](./docs/project-structure.md)
- [Configuration](./docs/configuration.md)
- [Dépannage](./docs/troubleshooting.md)

## Scripts

| Commande | Description |
|----------|-------------|
| `pnpm start` | Démarrer Metro |
| `pnpm android` | Build + lancer Android |
| `pnpm ios` | Build + lancer iOS |
| `pnpm web` | Lancer sur le web |
| `pnpm lint` | Linter |

## Stack

Expo 56 · React Native 0.85 · React 19 · TypeScript · pnpm
