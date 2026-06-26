# Dépannage

## Connexion Metro refusée (Android)

**Erreur** : `ConnectException: Failed to connect to /192.168.x.x:8081`

→ Voir le guide complet : [Réseau Android & VPN](./android-networking.md)

Résumé rapide :

```bash
adb reverse tcp:8081 tcp:8081
adb shell pm clear com.azkarminder.mobile
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

---

## Metro déjà en cours sur le port 8081

**Erreur** : port 8081 already in use

```bash
# Trouver le processus
lsof -i :8081

# Ou tuer tous les process Metro
killall node
```

Relancez ensuite `pnpm start`.

---

## Émulateur non détecté

```bash
adb devices
```

Si la liste est vide :

1. Ouvrez Android Studio → Device Manager → démarrez un émulateur
2. Ou : `emulator -list-avds` puis `emulator -avd <nom>`

---

## Build Gradle échoue

```bash
cd android
./gradlew clean
cd ..
pnpm android
```

Si le problème persiste :

```bash
pnpm expo prebuild --clean
pnpm android
```

---

## `adb: command not found`

Ajoutez Android SDK platform-tools au PATH :

```bash
export PATH=$PATH:$HOME/Library/Android/sdk/platform-tools
```

---

## L'app affiche un écran blanc

1. Secouez l'appareil ou `Cmd+M` (émulateur) pour ouvrir le menu dev
2. Choisissez **Reload**
3. Vérifiez les logs Metro dans le terminal
4. Vérifiez que Metro tourne et que l'URL est correcte

---

## Changement de plugin natif non pris en compte

Après modification de `app.json` (plugins, permissions) :

```bash
pnpm expo prebuild
pnpm android   # ou pnpm ios
```

Un simple reload Metro ne suffit pas pour les changements natifs.

---

## Expo Go au lieu du development build

Metro affiche `Using Expo Go` alors que le projet utilise `expo-dev-client`.

Appuyez sur `s` dans le terminal Metro pour basculer vers **development build**.

---

## Problèmes avec le VPN

- Sur **émulateur** : utilisez toujours `--localhost` + `adb reverse`
- Sur **téléphone** : essayez `--tunnel` ou désactivez le VPN temporairement
- Évitez le tethering USB en parallèle du Wi-Fi

---

## Cache Metro corrompu

```bash
pnpm start --clear
```

Ou :

```bash
rm -rf node_modules/.cache
pnpm start --clear
```

---

## Réinstaller les dépendances

```bash
rm -rf node_modules
pnpm install
```

---

## Vérifier que Metro répond

```bash
curl http://127.0.0.1:8081/status
# Attendu : packager-status:running
```

---

## Besoin d'aide supplémentaire

1. Logs Metro dans le terminal
2. Logs Android : `adb logcat *:E` (filtrer les erreurs)
3. [Documentation Expo v56](https://docs.expo.dev/versions/v56.0.0/)
4. [Discord Expo](https://chat.expo.dev)
