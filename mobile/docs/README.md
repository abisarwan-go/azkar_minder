# Documentation — Azkar Minder Mobile

Application mobile **Azkar Minder**, construite avec [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) et [Expo Router](https://docs.expo.dev/router/introduction/).

## Sommaire

| Document | Description |
|----------|-------------|
| [Démarrage rapide](./getting-started.md) | Prérequis, installation, premier lancement |
| [Développement](./development.md) | Scripts, dev client, émulateur, appareil physique |
| [Réseau Android & VPN](./android-networking.md) | Connexion Metro ↔ émulateur (problème fréquent) |
| [Structure du projet](./project-structure.md) | Arborescence, routing, conventions de code |
| [Configuration](./configuration.md) | `app.json`, TypeScript, identifiants natifs |
| [Dépannage](./troubleshooting.md) | Erreurs courantes et solutions |

## Stack technique

| Technologie | Version |
|-------------|---------|
| Expo | ~56.0.12 |
| React Native | 0.85.3 |
| React | 19.2.3 |
| Expo Router | ~56.2.11 |
| TypeScript | ~6.0.3 |
| Gestionnaire de paquets | pnpm |

## Commandes essentielles

```bash
pnpm install          # Installer les dépendances
pnpm start            # Démarrer Metro (dev server)
pnpm start --localhost  # Metro en mode localhost (émulateur + VPN)
pnpm android          # Build + lancer sur Android
pnpm android --no-bundler  # Lancer l'app sans redémarrer Metro
pnpm ios              # Build + lancer sur iOS
pnpm web              # Lancer dans le navigateur
```

### Émulateur Android (deux terminaux)

```bash
# Terminal 1
adb reverse tcp:8081 tcp:8081
pnpm start --localhost

# Terminal 2
pnpm android --no-bundler
```

## Liens utiles

- [Documentation Expo v56](https://docs.expo.dev/versions/v56.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
