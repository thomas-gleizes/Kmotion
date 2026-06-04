# kMotion - Extension

Une extension Chrome/Firefox pour convertir des vidéos YouTube en MP3 avec kMotion.

## Structure

```
src/
├── components/          # Composants React pour la popup
│   ├── LoginForm.tsx    # Formulaire de connexion
│   ├── VideoDetails.tsx # Détails et conversion de la vidéo
│   ├── NoVideo.tsx      # Message quand pas sur YouTube
│   └── PopupApp.tsx     # Composant principal
├── utils/
│   ├── api.ts           # Classe client API
│   ├── constants.ts     # Constantes
│   └── youtube.ts       # Utilitaires YouTube
├── stores.ts            # Store Zustand pour l'état global
├── types.d.ts           # Types globaux
├── popup.tsx            # Point d'entrée React
├── popup.html           # HTML de la popup
├── background.ts        # Service Worker
├── content.ts           # Content Script
└── index.css            # Styles Tailwind
```

## Développement

```bash
# Installation des dépendances
pnpm install

# Mode développement (hot reload)
pnpm dev

# Build production
pnpm build
```

## Installation de l'extension

### Chrome
1. Aller à `chrome://extensions/`
2. Activer "Mode de développement"
3. Cliquer sur "Charger l'extension non empaquetée"
4. Sélectionner le dossier `dist/`

### Firefox
1. Aller à `about:debugging#/runtime/this-firefox`
2. Cliquer sur "Charger une extension temporaire"
3. Sélectionner le fichier `manifest.json` dans le dossier `dist/`

## Fonctionnalités

- ✅ Authentification JWT
- ✅ Détection automatique des vidéos YouTube
- ✅ Affichage des infos de la vidéo
- ✅ Conversion en MP3 avec loader
- ✅ Vérification si vidéo déjà convertie
- ✅ Interface responsive et intuitive

## Architecture

### Flux d'authentification
1. L'utilisateur rentre ses identifiants
2. La réponse API inclut un JWT
3. Le token est stocké dans localStorage
4. Les requêtes suivantes l'incluent dans le header Authorization

### Flux de détection vidéo
1. Content Script détecte les changements d'URL sur YouTube
2. Envoie un message au background script avec l'ID vidéo
3. La popup récupère l'ID vidéo de l'onglet actif
4. Affiche les détails de la vidéo depuis l'API

### Flux de conversion
1. L'utilisateur clique sur "Convert to MP3"
2. La popup appelle l'endpoint de conversion
3. Un loader s'affiche pendant le traitement
4. Les données vidéo sont rafraîchies après conversion

