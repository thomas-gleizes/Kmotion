# 🎉 START HERE - Extension kMotion
Bienvenue! Vous avez une **extension Chrome/Firefox complète et fonctionnelle**! 
## ⚡ Démarrage Ultra-Rapide (5 minutes)
### 1. Installation
```bash
cd /home/thomas.gleizes@acelys.local/workspace/local-test
pnpm install
cd apps/extension
pnpm build
```
### 2. Chargement dans le navigateur
**Chrome:**
- Aller à: `chrome://extensions/`
- Activer "Developer mode"
- Cliquer "Load unpacked"
- Sélectionner: `apps/extension/dist/`
**Firefox:**
- Aller à: `about:debugging#/runtime/this-firefox`
- Cliquer "Load Temporary Add-on"
- Sélectionner: `apps/extension/dist/manifest.json`
### 3. C'est prêt! 🚀
L'extension apparaît dans votre barre d'outils.
---
## 📚 Documentations (Par priorité)
| Fichier | Temps | Objectif |
|---------|-------|----------|
| **GETTING_STARTED.md** | 5 min | Instructions complètes |
| **TEST_CHECKLIST.md** | 10 min | Tester les features |
| **README.md** | 5 min | Vue d'ensemble |
| **TROUBLESHOOTING.md** | 10 min | Si erreurs |
| **ARCHITECTURE.md** | 15 min | Détails techniques |
| **PROJECT_SUMMARY.md** | 10 min | Résumé complet |
---
## ⚙️ Configuration Requise
**Pour que l'extension fonctionne:**
1. ✅ L'API doit être running sur `localhost:8000`
2. ✅ Endpoints doivent exister (voir DEV_NOTES.md)
3. ✅ CORS doit être configuré sur l'API
---
## 🎯 Premiers Tests
Après installation:
1. Cliquez sur l'extension
2. Vous devez voir un formulaire de login
3. Rentrez vos credentials
4. Si ok → vous êtes loggé!
5. Allez sur YouTube
6. La popup devrait montrer les détails de la vidéo
---
## ⚠️ Si ça ne marche pas?
```
Popup blank?     → Voir TROUBLESHOOTING.md
API error?       → Vérifier URL dans src/utils/api.ts
No token?        → Check browser console (F12)
Video not found? → Vérifier endpoints API
```
---
## 📁 Structure Clé
```
src/
├── components/      ← 4 composants React
├── utils/          ← API client + helpers
├── stores.ts       ← État global (3 stores)
├── popup.tsx       ← Point d'entrée
├── background.ts   ← Service worker
└── content.ts      ← Script YouTube
manifest.json      ← Configuration extension
vite.config.ts     ← Build
```
---
## 🚀 Commandes Principales
```bash
pnpm dev           # Watch mode
pnpm build         # Build production
bash verify.sh     # Vérifier structure
```
---
## 📖 Prochaines Étapes
1. **Immédiatement:**
   - [ ] Lire: `GETTING_STARTED.md`
   - [ ] Build: `pnpm build`
   - [ ] Load: Chrome/Firefox
2. **Tester:**
   - [ ] Voir: `TEST_CHECKLIST.md`
   - [ ] Login test
   - [ ] YouTube detection
   - [ ] Conversion test
3. **Adapter:**
   - [ ] Vérifier endpoints API
   - [ ] Éditer: `src/utils/api.ts`
   - [ ] Tester avec votre API
4. **Personnaliser:**
   - [ ] Adapter `manifest.json`
   - [ ] Personnaliser UI si needed
   - [ ] Ajouter features
---
## 🎯 Qu'y a-t-il dedans?
✅ **React** - Framework UI moderne
✅ **TypeScript** - Type safety
✅ **Tailwind CSS** - Styling responsive
✅ **Zustand** - État global
✅ **Ky** - HTTP client simple
✅ **Vite** - Build moderne
✅ **Features:**
- Authentication JWT
- YouTube detection
- Video info display
- MP3 conversion
- Error handling
- Responsive UI
✅ **Documentation:**
- 8 fichiers documentation complète
- Guide d'installation
- Architecture détaillée
- Troubleshooting
- Tests checklist
---
## 💡 Tips Important
- 📌 **Après chaque build**, recharger l'extension dans le navigateur
- 🔍 **Check DevTools** (F12) en cas d'erreurs
- 🌐 **API doit être running** sur localhost:8000
- ✅ **Suivre TEST_CHECKLIST.md** pour tester
- 📚 **Lire ARCHITECTURE.md** pour comprendre
---
## 🎉 Vous Êtes Prêts!
Vous avez:
- ✅ Une extension Chrome/Firefox complète
- ✅ Authentification JWT
- ✅ Détection YouTube
- ✅ Conversion MP3
- ✅ Documentation complète
**Prochaine étape:** Lire `GETTING_STARTED.md` →
---
## 📞 Besoin d'aide?
| Problème | Solution |
|----------|----------|
| Popup blanc | → TROUBLESHOOTING.md |
| API error | → DEV_NOTES.md |
| Pas sur YouTube | → TEST_CHECKLIST.md |
| Structure? | → ARCHITECTURE.md |
| Tout? | → INDEX.md |
---
**Happy coding! 🚀**
