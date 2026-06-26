# Réseau Android & VPN

Guide pour résoudre les erreurs de connexion entre l'émulateur Android et Metro Bundler.

## Symptôme

L'app affiche une erreur du type :

```
java.net.ConnectException: Failed to connect to /192.168.x.x:8081
```

Variantes courantes :

- `ETIMEDOUT` — l'émulateur ne peut pas atteindre l'IP
- `ECONNREFUSED` — l'IP est joignable mais rien n'écoute sur le port 8081

## Cause

Expo choisit automatiquement une adresse réseau (mode **LAN**) pour que Metro soit accessible depuis un appareil. Sur un Mac avec **VPN**, **tethering** ou plusieurs interfaces réseau, Expo peut sélectionner une mauvaise IP — par exemple `192.168.43.x` (hotspot USB) au lieu de l'interface utilisable par l'émulateur.

L'émulateur Android tourne dans un réseau virtuel isolé. Il **ne peut pas** joindre directement les IP LAN du Mac (sauf `10.0.2.2` dans certains cas). La solution standard est **`adb reverse`** + **localhost**.

## Solution — Émulateur

### Étape 1 : Configurer le port forwarding

```bash
adb reverse tcp:8081 tcp:8081
```

Vérifiez :

```bash
adb reverse --list
# Attendu : host-XX tcp:8081 tcp:8081
```

### Étape 2 : Forcer localhost

```bash
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

Ou démarrez Metro séparément :

```bash
pnpm start --localhost
```

### Étape 3 : Vérifier l'URL Metro

Dans le terminal, l'URL doit ressembler à :

```
exp+mobile://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081
```

**Pas** `192.168.x.x` ni `10.x.x.x` (IP VPN).

## URL en cache dans le dev client

Si Metro affiche `127.0.0.1` mais l'app tente encore l'ancienne IP, le **development build** a mémorisé l'URL précédente.

Solutions :

```bash
# Effacer les données de l'app
adb shell pm clear com.azkarminder.mobile

# Puis relancer avec la bonne URL
adb reverse tcp:8081 tcp:8081
REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android
```

Ou ouvrir manuellement le deep link :

```bash
adb shell am start -a android.intent.action.VIEW \
  -d "exp+mobile://expo-development-client/?url=http%3A%2F%2F127.0.0.1%3A8081"
```

Dans le launcher du dev client, saisir manuellement : `http://127.0.0.1:8081`

## Impact du VPN

Avec un VPN actif :

- Expo détecte plusieurs interfaces (`10.x.x.x`, `192.168.x.x`, etc.)
- Le mode LAN choisit souvent la mauvaise
- **Toujours utiliser `--localhost` + `adb reverse`** sur émulateur
- Ou **`--tunnel`** si localhost ne suffit pas

Désactiver temporairement le VPN peut aussi aider Expo à choisir la bonne interface en mode LAN.

## Appareil physique (pas émulateur)

Sur un vrai téléphone, `adb reverse` ne s'applique pas (sauf en USB avec configuration spécifique). Utilisez :

```bash
pnpm start --lan
```

Conditions :

- Téléphone et Mac sur le **même Wi-Fi**
- Pas de réseau invité isolé
- Pare-feu Mac autorisant le port **8081**

L'IP affichée par Metro doit être celle du Wi-Fi du Mac.

## Mode tunnel (dernier recours)

```bash
pnpm start --tunnel
```

Avantages : fonctionne avec VPN, hotspot, pare-feu.  
Inconvénients : plus lent, nécessite un compte Expo.

## Récapitulatif

| Contexte | Commande |
|----------|----------|
| Émulateur (quotidien, 2 terminaux) | Terminal 1 : `adb reverse tcp:8081 tcp:8081` + `pnpm start --localhost` — Terminal 2 : `pnpm android --no-bundler` |
| Émulateur + VPN (1 terminal) | `adb reverse tcp:8081 tcp:8081` puis `REACT_NATIVE_PACKAGER_HOSTNAME=127.0.0.1 pnpm android` |
| Émulateur sans VPN (1 terminal) | `adb reverse tcp:8081 tcp:8081` puis `pnpm android` |
| Téléphone physique | `pnpm start --lan` |
| Réseau problématique | `pnpm start --tunnel` |
