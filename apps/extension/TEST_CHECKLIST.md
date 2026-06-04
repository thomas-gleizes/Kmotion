/**
 * Test checklist - À vérifier dans le navigateur
 */

// 1. AUTHENTIFICATION
// ✅ Charger l'extension dans Chrome/Firefox
// ✅ Ouvrir la popup (click sur l'icône)
// ✅ Voir le formulaire de login
// ✅ Rentrer email/password invalides → voir erreur
// ✅ Rentrer email/password valides → rediriger vers main
// ✅ Token sauvegardé dans localStorage
// ✅ Rafraîchir la popup → rester loggé
// ✅ Click logout → retour login form
// ✅ Vérifier console pour les erreurs

// 2. DÉTECTION VIDÉO YOUTUBE
// ✅ Aller sur https://www.youtube.com/watch?v=dQw4w9WgXcQ
// ✅ Ouvrir la popup
// ✅ Voir les détails de la vidéo
// ✅ Essayer plusieurs URLs YouTube:
//    - youtube.com/watch?v=...
//    - youtu.be/...
//    - youtube.com/embed/...
// ✅ Aller sur une page non-YouTube → voir message "Not on YouTube"

// 3. VIDEO DETAILS & CONVERSION
// ✅ Sur une vidéo YouTube:
//    - Voir titre, artiste
//    - Si pas enregistrée: bouton "Add Video"
//    - Si enregistrée: voir "Already converted" ou "Convert to MP3"
// ✅ Click "Convert to MP3" → voir loader
// ✅ Après conversion → bouton devient "Already converted"
// ✅ Erreur de conversion → voir message d'erreur

// 4. NAVIGATION
// ✅ Changer d'URL YouTube → popup met à jour
// ✅ Popup responsive sur différentes tailles
// ✅ Pas de CSS breakage

// 5. ERREURS
// ✅ Console sans erreurs JavaScript
// ✅ API errors gérées proprement
// ✅ Network errors gérées
// ✅ Token expiry gérée (logout automatique)

export const testChecklist = [
  "Authentication flow",
  "YouTube video detection",
  "Video details display",
  "Video conversion",
  "Error handling",
  "localStorage persistence",
  "UI responsiveness",
  "Chrome console cleanliness",
] as const

