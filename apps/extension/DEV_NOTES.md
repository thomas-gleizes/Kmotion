# kMotion Extension - DEV Notes

## Configuration Hot Reload

Pour le développement avec hot reload, nous utilisons Vite qui gère automatiquement :
- Le rechargement des modules
- L'actualisation du navigateur lors des changements

### Lancer le dev
```bash
pnpm dev
```

Vite se lancera sur http://localhost:5173. Cependant, pour une extension, l'installation manuelle est nécessaire :

1. Build initiale: `pnpm build`
2. Charger dist/ dans le navigateur
3. À chaque changement, refaire: `pnpm build` et recharger l'extension

## Endpoints API requis

L'extension utilise les endpoints suivants:

```
POST /auth/login                          # Connexion
GET  /users/profile                       # Récupérer le profil
GET  /music/youtube/{youtubeId}           # Récupérer les infos vidéo
POST /music/youtube                       # Ajouter vidéo (body: {youtubeId})
POST /music/{musicId}/convert             # Convertir en MP3
```

**À adapter selon votre API réelle**

## Structure des réponses

### Login Response
```typescript
{
  access_token: string
  user: {
    id: string
    email: string
    name?: string
  }
}
```

### Music Response
```typescript
{
  id: string
  title: string
  artist?: string
  youtubeId: string
  duration: number
  thumbnail?: string
  convertedAt?: Date
}
```

## Prochaines étapes

1. **Tester les endpoints** - Adapter les appels API selon votre API réelle
2. **Ajouter les endpoints manquants** - Si certains endpoints n'existent pas
3. **Refiner l'UI** - Ajouter plus de détails/images dans VideoDetails
4. **Erreur handling** - Améliorer les messages d'erreur
5. **Internationalization** - Ajouter d'autres langues si nécessaire

## Dépannage

### L'extension ne se charge pas
- Vérifier que le manifest.json est valide
- S'assurer que dist/ contient les fichiers build
- Vérifier la console du navigateur pour les erreurs

### Les APIs ne répondent pas
- S'assurer que l'API tourne sur http://localhost:8000
- Vérifier les headers CORS
- Vérifier le token JWT est valide

### Hot reload ne fonctionne pas
- Recharger l'extension manuellement après chaque build
- Ou utiliser web-ext watch (si configuré)

