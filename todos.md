List des choses a faire 

1. ✅ [FAIT] Modifie la gestion d'une playlist, il faudrait avoir un bouton ajouté sur la page playlist, avec une model qui permet de chercher des musics, si elles sont déja sur la playlist alors tu affiche une icon check, sinon tu rajoute une plus, il faut pouvoir sélecitonné plusieurs musics dans la meme recherche puis faire une validation pour sauvegardé
2. ✅ [FAIT] Améliore l'ajout, si la music est déja sur la playlist, il faut pouvoir le voir avec un check vert, sinon rajoute un icon plus dans un petit cercle, rajoute une petite bar de recherche en haut pour filtré les playlist
3. ✅ [FAIT] Gestion d'un theme, rajoute dans le profil la possiblé de changé de theme sombre et claire mais pas que, rajoute d'autre theme inspiré des standard du web
4. ✅ [FAIT] Dans le panel admin, pour les users, rajoute des infos, date d'inscription, dernier activité (example: il y a 12Heurs/jours, ans)
5. ✅ [FAIT] Dans le panel admin, sur la partie musics, rajoute un search input qui permet de filtré les musics, garde la pagination telquel

Idées / améliorations futures :

6. Favoris / likes : bouton cœur sur chaque musique, page "Titres likés", tri par favoris
7. Gestion de la file de lecture : retirer un titre de la queue, glisser-déposer pour réordonner
8. Historique d'écoute : liste des derniers titres joués, reprise de lecture à la position où on s'est arrêté
9. Toasts/notifications : feedback visuel sur "ajouté à la playlist", "titre supprimé", "sync terminée", etc.
10. Raccourcis clavier : petite modale d'aide (?) listant les raccourcis déjà gérés (Espace, S, R, N, P...)
11. Glisser-déposer dans les playlists : réordonner les morceaux d'une playlist par drag & drop
12. Filtres de recherche : filtrer par durée, par artiste, par playlist
13. Sélection multiple dans l'admin : supprimer/bannir plusieurs éléments d'un coup
14. Indicateur de progression de conversion : afficher un état "en cours de conversion" sur la carte du titre tant que converted: false
15. Égaliseur audio simple (bass/mid/treble via Web Audio API)
16. Mode hors-ligne réel (PWA) : service worker + cache des fichiers audio téléchargés pour l'écoute hors connexion
17. Statistiques d'écoute : page "Wrapped" perso (top artistes, temps total d'écoute, titres les plus joués par période)
18. Playlists intelligentes : playlists auto-générées par règles ("ajoutés récemment", "les plus écoutés", "jamais écoutés")
19. Playlists collaboratives / partagées : partager une playlist avec d'autres utilisateurs (lecture ou édition)
20. WebSocket pour le statut de conversion : remplacer le polling par un push temps réel quand une conversion se termine
21. Application mobile native : packager le PWA avec Capacitor pour publier sur stores (lecture en arrière-plan, notifications)
22. Tags/genres : catégoriser les musiques, filtrer/parcourir par genre
23. Quotas de téléchargement par utilisateur : limiter le nombre de conversions/jour
24. Dashboard admin avec métriques : graphique d'utilisation du stockage, file de conversion, activité des utilisateurs
