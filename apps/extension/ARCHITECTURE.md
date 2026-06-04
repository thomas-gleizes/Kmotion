# 📦 Structure de l'Extension kMotion

## Hiérarchie des fichiers

```
apps/extension/
├── src/
│   ├── components/                    # Composants React
│   │   ├── LoginForm.tsx             # Formulaire d'authentification
│   │   ├── VideoDetails.tsx          # Affichage des détails vidéo
│   │   ├── NoVideo.tsx               # Écran "pas de vidéo"
│   │   └── PopupApp.tsx              # Component racine de la popup
│   │
│   ├── utils/                        # Utilitaires
│   │   ├── api.ts                    # Client API (avec Ky)
│   │   ├── constants.ts              # Constantes globales
│   │   └── youtube.ts                # Extraction d'ID YouTube
│   │
│   ├── stores.ts                     # Zustand stores (auth, video, music)
│   ├── types.d.ts                    # Types TypeScript globaux
│   │
│   ├── popup.html                    # HTML point d'entrée
│   ├── popup.tsx                     # Point d'entrée React
│   ├── background.ts                 # Service Worker (Chrome/Firefox)
│   ├── content.ts                    # Content Script (injecté dans les pages)
│   └── index.css                     # Styles Tailwind
│
├── manifest.json                      # Manifest de l'extension
├── vite.config.ts                    # Configuration Vite
├── tsconfig.json                     # Configuration TypeScript
├── tailwind.config.js                # Configuration Tailwind
├── postcss.config.js                 # Configuration PostCSS
├── package.json                      # Dépendances
│
├── README.md                          # Documentation
├── DEV_NOTES.md                       # Notes développement
├── deploy.sh                          # Script de déploiement
└── .env.example                       # Variables d'environnement
```

## 🔄 Flux d'application

### 1. **Authentification**
```
User → LoginForm → API /auth/login → JWT Token
                           ↓
                    Stocké dans localStorage
                           ↓
                    Zustand authStore
```

### 2. **Détection Vidéo YouTube**
```
Content Script (content.ts)
    ↓ (détecte URL change)
Background Script (background.ts)
    ↓ (envoie message)
Popup (PopupApp.tsx)
    ↓ (extrait video ID)
API /music/youtube/{id}
    ↓ (récupère infos)
VideoDetails.tsx (affiche)
```

### 3. **Conversion MP3**
```
User clique "Convert to MP3"
    ↓
API POST /music/{id}/convert
    ↓ (loader)
API GET /music/youtube/{id}
    ↓ (refresh data)
Affiche "Already converted"
```

## 📱 Composants

### LoginForm.tsx
- Utilise `react-hook-form` + `zod` pour validation
- Appel API login
- Stockage du JWT
- Gestion des erreurs

### VideoDetails.tsx
- Fetch les infos vidéo depuis API
- Affiche titre, artiste, thumbnail
- Bouton "Convert" ou "Already converted"
- Loader pendant conversion

### NoVideo.tsx
- Message si pas sur YouTube
- Lien vers YouTube.com
- Responsive

### PopupApp.tsx
- Logic principale
- Gère l'authentification
- Détecte vidéo YouTube
- Routage composants

## 🔌 APIs Utilisées

```typescript
// Authentification
POST /api/v1/auth/login
Headers: Content-Type: application/json
Body: { email, password }
Response: { access_token, user }

// Profil utilisateur
GET /api/v1/users/profile
Headers: Authorization: Bearer {token}

// Récupérer vidéo YouTube
GET /api/v1/music/youtube/{youtubeId}
Headers: Authorization: Bearer {token}
Response: Music | null

// Ajouter vidéo YouTube
POST /api/v1/music/youtube
Headers: Authorization: Bearer {token}
Body: { youtubeId }
Response: Music

// Convertir en MP3
POST /api/v1/music/{musicId}/convert
Headers: Authorization: Bearer {token}
Response: { success, message }
```

## 🛠 Configuration de Développement

### Vite
- Build multiple (popup, background, content)
- Source maps
- Minification avec terser

### Tailwind CSS
- Classes utilitaires
- Réactif
- Build optimisé

### TypeScript
- Strict mode
- JSX React 17+
- Chrome APIs typing

## 🚀 Déploiement

### Chrome
1. `pnpm build`
2. `chrome://extensions/`
3. Developer mode ON
4. Load unpacked → select dist/

### Firefox
1. `pnpm build`
2. `about:debugging#/runtime/this-firefox`
3. Load temporary → select dist/manifest.json

## 📚 Dépendances Clés

```json
{
  "react": "^19.0.0",              // Framework UI
  "react-hook-form": "^7.45.1",    // Gestion formulaires
  "@hookform/resolvers": "^3.1.1", // Validation Zod
  "zustand": "^5.0.2",             // État global
  "ky": "^0.33.3",                 // Client HTTP
  "tailwindcss": "^3.4.16",        // Styles
  "react-icons": "^4.10.1",        // Icônes
  "@types/chrome": "^0.0.260",     // Types Chrome API
  "vite": "^6.0.3",                // Bundler
  "@vitejs/plugin-react": "^4.0.3" // Support React
}
```

## 🎯 Points Clés d'Implementation

1. **Storage**
   - localStorage pour JWT
   - Zustand pour état runtime

2. **Communication**
   - Content Script → Background → Popup (messages)
   - Popup → API (fetch avec Authorization header)

3. **Erreur Handling**
   - Try/catch autour des appels API
   - Messages d'erreur utilisateur
   - Token expiry handling

4. **Performance**
   - Cache des infos vidéo
   - Debounce sur les recherches
   - Lazy loading des images

## ⚠️ À Faire

- [ ] Adapter les endpoints API selon votre implémentation réelle
- [ ] Ajouter loading states plus détaillés
- [ ] Gérer expiration du token
- [ ] Ajouter retry logic pour les API calls
- [ ] Implémenter un vrai hot reload pendant le dev
- [ ] Ajouter des tests unitaires
- [ ] Internationalization (i18n)

