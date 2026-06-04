# 🐛 Troubleshooting Guide - Extension kMotion

## ❌ Erreurs Communes & Solutions

### 1. Extension ne se charge pas
```
Error: Manifest is not valid JSON
```
**Solution:**
- Vérifier `manifest.json` est valide
- Voir JSON Validator online
- Relancer build: `pnpm build`

### 2. API calls ne fonctionnent pas
```
Error: Failed to fetch from /api/v1/auth/login
```
**Solutions:**
- ✅ Vérifier API est running: `localhost:8000`
- ✅ Vérifier URL dans `src/utils/api.ts`
- ✅ Vérifier CORS headers sur API
- ✅ Check Network tab (F12) pour erreurs

### 3. Token not saving
```
localStorage.getItem('extension_auth_token') returns null
```
**Solutions:**
- ✅ Chrome: Vérifier permissions dans `manifest.json`
- ✅ Vérifier `storage` permission existe
- ✅ Try: `chrome.storage.local` instead

### 4. YouTube detection ne fonctionne pas
```
videoId remains null on YouTube
```
**Solutions:**
- ✅ Vérifier Content Script injecté: `chrome://extensions → Details`
- ✅ Vérifier URL patterns dans `content.ts`
- ✅ Essayer différents URLs YouTube
- ✅ Check console pour errors

### 5. Popup blank / white screen
```
Popup shows nothing
```
**Solutions:**
- ✅ Check browser console (F12)
- ✅ Vérifier `popup.html` existe
- ✅ Vérifier `popup.tsx` n'a pas d'errors
- ✅ Relancer build: `pnpm build`
- ✅ Reload extension

### 6. TypeError: extensionapi is not defined
```
Error in popup
```
**Solutions:**
- ✅ Vérifier import dans `PopupApp.tsx`
- ✅ Check `src/utils/api.ts` existe
- ✅ Vérifier `extractVideoId` import

### 7. Conversion button disabled
```
"Convert" button grayed out
```
**Solutions:**
- ✅ Vérifier `music` data loaded correctly
- ✅ Vérifier API endpoint `/music/youtube/{id}` existe
- ✅ Check API response format
- ✅ Vérifier token valide

### 8. Permission denied errors
```
Error: Permission denied
```
**Solutions:**
- ✅ Check `manifest.json` permissions
- ✅ Ajouter si missing: `"tabs"`, `"activeTab"`, `"scripting"`
- ✅ Relancer build + reload extension

---

## 🔍 Debugging Steps

### 1. Check Extension Console
```
Chrome:
1. chrome://extensions/
2. Find kMotion extension
3. Click "Details"
4. Click "Errors" (if red)
5. See error messages
```

### 2. Inspect Popup
```
Chrome:
1. Right-click extension icon
2. Select "Inspect popup"
3. See console errors
4. Check Network tab
```

### 3. Background Script Logs
```
Chrome:
1. chrome://extensions/
2. Click "Details" on kMotion
3. Click "Inspect views: service worker"
4. See background logs
```

### 4. Check Network Requests
```
In popup inspector:
1. Open DevTools (F12)
2. Go to Network tab
3. Click extension button
4. See API requests
5. Check response status/body
```

### 5. localStorage Inspection
```
In popup inspector:
1. Open DevTools Console
2. Type: localStorage.getItem('extension_auth_token')
3. See token or null
```

---

## 🛠️ Common Fixes

### Build Issues
```bash
# Clean and rebuild
rm -rf dist
rm -rf node_modules/.pnpm
pnpm install
pnpm build

# Or force rebuild
pnpm build --force
```

### Token Issues
```bash
# Clear all storage
# In browser console:
localStorage.clear()
# Reload extension
```

### Version Conflicts
```bash
# Update all dependencies
cd apps/extension
pnpm update --latest
pnpm build
```

---

## 📋 Pre-Deployment Checklist

- [ ] `pnpm build` completes without errors
- [ ] `dist/` folder has files
- [ ] `manifest.json` is valid
- [ ] `src/utils/api.ts` points to correct API
- [ ] Extension loads in Chrome/Firefox
- [ ] Login screen appears
- [ ] YouTube detection works
- [ ] Conversion button functional
- [ ] No console errors
- [ ] Test checklist passed

---

## 🔗 API Verification

### Test API Connection
```bash
# From terminal
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Should return: { "access_token": "...", "user": {...} }
```

### Test Video Endpoint
```bash
# Replace TOKEN and VIDEO_ID
curl -X GET http://localhost:8000/api/v1/music/youtube/VIDEO_ID \
  -H "Authorization: Bearer TOKEN"

# Should return music info or null
```

---

## 🚀 Performance Tips

- Minimize popup size data
- Don't load images by default
- Cache API responses
- Debounce searches
- Use lazy loading

---

## 💬 Getting Help

If still stuck:

1. **Check logs:**
   - Browser console (F12)
   - Extension errors (chrome://extensions/)
   - Network tab responses

2. **Review docs:**
   - README.md
   - ARCHITECTURE.md
   - DEV_NOTES.md

3. **Verify setup:**
   - Run: `bash verify.sh`
   - Check all files exist
   - Verify dependencies installed

4. **Test manually:**
   - Follow TEST_CHECKLIST.md
   - Test each feature separately
   - Check with working API

---

## 📝 Quick Reference

| Issue | Check | Fix |
|-------|-------|-----|
| Extension blank | console.log | rebuild |
| API 404 | Network tab | check URL |
| No token | localStorage | login again |
| Video not found | API response | check endpoint |
| Button disabled | store state | verify data |
| Permission error | manifest.json | add permissions |

---

## 🎯 Still Stuck?

1. ✅ Run `bash verify.sh`
2. ✅ Check browser console
3. ✅ Verify API is running
4. ✅ Test with curl
5. ✅ Clear cache + rebuild
6. ✅ Read ARCHITECTURE.md
7. ✅ Compare with DEV_NOTES.md

