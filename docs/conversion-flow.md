# Flux de conversion d'une vidéo

Ce document décrit comment une vidéo YouTube devient une musique de la bibliothèque kmotion :
depuis l'extension navigateur, à travers le backend (`apps/server`, module `music`), jusqu'au
service de conversion externe **yt-converter v4**.

La conversion est **asynchrone** : le backend enregistre la musique tout de suite en `pending`,
puis une tâche planifiée interroge le convertisseur jusqu'à ce qu'elle passe `ready` ou `failed`.

## Acteurs

| Acteur | Code |
| --- | --- |
| Content script / service worker | `apps/extension/src/content.ts`, `background.ts` — détectent l'id de la vidéo YouTube ouverte |
| Popup de l'extension | `apps/extension/src/components/tabs/VideoTab.tsx`, client `utils/api.ts` |
| `MusicController` | `apps/server/src/music/presentation/music.controller.ts` |
| Handlers CQRS | `PreviewMediaHandler`, `AddMusicHandler`, `RefreshConversionsHandler` |
| `ConverterServiceAdapter` | `music/infrastructure/adapters/converter-service.adapter.ts` (+ `converter-mapping.ts`) |
| `YtConverterHttpService` | `core/converter/yt-converter-http.service.ts` — client HTTP de yt-converter |
| `RefreshConversionsTask` | `music/infrastructure/tasks/refresh-conversions.task.ts` — toutes les 15 s |
| PostgreSQL | table `music` (colonne `conversion_status`) |

## Vue d'ensemble (séquence)

```mermaid
sequenceDiagram
    autonumber
    actor U as Utilisateur
    participant CS as Content script<br/>(page YouTube)
    participant P as Popup extension<br/>(VideoTab)
    participant API as Backend kmotion<br/>(MusicController)
    participant DB as PostgreSQL
    participant YT as yt-converter v4

    U->>CS: ouvre une vidéo YouTube
    CS-->>P: YOUTUBE_VIDEO_DETECTED { videoId }

    %% 1. La vidéo est-elle déjà connue ?
    P->>API: GET /musics/media/{videoId}?mediaSource=youtube
    API->>DB: findByMediaId (pending inclus)
    alt musique trouvée
        API-->>P: MusicResponseDto { converted }
        Note over P: converted ? « déjà convertie » : « en cours » (polling)
    else 404
        API-->>P: 404 → statut « not-found »

        %% 2. Prévisualisation
        P->>API: GET /musics/media/{videoId}/preview
        API->>YT: GET /sources/preview?url&start&end
        YT-->>API: info, maxDuration, clip, exceedsLimit
        API-->>P: MediaPreviewResponseDto
        Note over P: titre, durée, limite max,<br/>choix d'un extrait (start/end)
    end

    %% 3. Lancement de la conversion
    U->>P: clique « Convertir » / « Convertir l'extrait »
    P->>API: POST /musics { mediaId, mediaSource, clip? }
    API->>DB: findByMediaId — déjà présente ?
    API->>YT: POST /tracks { url, clip? }
    YT-->>API: { track (status pending), created }
    API->>DB: exist(converterId) — doublon côté convertisseur ?
    API->>DB: INSERT music (conversion_status = pending)
    API-->>P: id de la musique
    Note over P: statut « in-progress »

    %% 4. Conversion en arrière-plan
    par yt-converter convertit
        YT->>YT: téléchargement + extraction audio<br/>pending → processing → ready / failed
    and RefreshConversionsTask (toutes les 15 s)
        loop pour chaque musique pending / processing
            API->>YT: GET /tracks/{converterId}
            YT-->>API: track.status (404 → failed)
            API->>DB: UPDATE conversion_status, duration
        end
    and Popup (toutes les 5 s)
        loop tant que « in-progress »
            P->>API: GET /musics/media/{videoId}
            API-->>P: { converted }
        end
    end
    Note over P: converted = true → « déjà convertie »

    %% 5. Lecture
    U->>API: GET /musics/{id}/audio (ou /thumbnail)
    API->>YT: GET /tracks/{converterId} → URL signée
    API->>YT: GET audioUrl (stream)
    YT-->>API: flux audio
    API-->>U: StreamableFile (Cache-Control immutable)
```

## Décisions de `AddMusicHandler` (`POST /musics`)

```mermaid
flowchart TD
    A([POST /musics<br/>mediaId, mediaSource, clip?]) --> B{Musique déjà en base<br/>pour ce mediaId ?}
    B -- oui --> E1[DomainException]
    B -- non --> C[ConverterServiceAdapter.requestConversion<br/>POST /tracks]
    C --> D{Réponse de<br/>yt-converter ?}
    D -- erreur 4xx taguée --> E2["DomainException<br/>InvalidClip → « Invalid clip: … »<br/>DurationLimitExceeded → « Media is longer than … »<br/>InvalidSource → « Invalid media »<br/>SourceUnavailable → « Media is unavailable »"]
    D -- erreur réseau / 5xx --> E3[DomainException<br/>« Error while downloading track »]
    D -- track --> F{converterId déjà<br/>en base ?<br/>dédoublonnage du convertisseur}
    F -- oui --> E1
    F -- non --> G[Music.create<br/>conversionStatus = pending]
    G --> H[(INSERT music)]
    H --> I([Retourne music.id])

    E1 --> M{statut existant}
    M -- ready --> M1[« Media is already downloaded »]
    M -- pending / failed --> M2[« Track is downloading »]
    M1 & M2 --> X[Popup : reconnu comme<br/>« conversion déjà en cours »<br/>reste en in-progress]
    E2 & E3 --> Y[Popup : statut « error »<br/>+ message, bouton Réessayer]
```

> Les messages `Media is already downloaded` / `Track is downloading` sont reconnus par
> l'extension (`isInProgressError`) : ne pas les modifier sans mettre à jour `VideoTab.tsx`.

## Cycle de vie d'une conversion

Les quatre états de yt-converter sont conservés tels quels par `toConversionStatus`
(`converter-mapping.ts`) : `pending` = en file d'attente, `processing` = conversion en cours.

```mermaid
stateDiagram-v2
    direction LR
    [*] --> pending: POST /musics<br/>(AddMusicHandler)

    note right of pending
        Tant que non ready : absente des listes / recherche
        (isListable = ready uniquement), visible par mediaId / id
        et dans l'onglet admin Conversions
    end note

    pending --> processing: RefreshConversions<br/>track.status = processing
    pending --> ready: RefreshConversions<br/>track.status = ready
    processing --> ready: RefreshConversions<br/>track.status = ready
    pending --> failed: track.status = failed<br/>ou track supprimé (404)
    processing --> failed: track.status = failed<br/>ou track supprimé (404)
    ready --> [*]: audio et vignette<br/>servis en streaming
    failed --> [*]: supprimable depuis l'admin
```

## Suivi admin des conversions

L'onglet **Administration → Conversions** (`apps/web/src/features/admin/components/ConversionsSection.tsx`)
appelle `GET /musics/conversions` (admin, `FindConversionsQuery` → `findUnfinished`) toutes les 5 s :
toutes les musiques non `ready`, de la plus ancienne à la plus récente, avec un badge
« En file d'attente » / « Conversion en cours » / « Échouée ». Une conversion échouée peut être
supprimée pour libérer la vidéo et la relancer.

## Synchronisation manuelle (admin)

`POST /musics/sync` (`SyncMusicHandler`) récupère **tous** les tracks de yt-converter
(`GET /tracks`) et enregistre ceux dont la source est supportée et qui ne sont pas encore en base
(`MusicsFactory.fromTrack`). Utile pour rattraper des conversions faites hors de kmotion.

```mermaid
flowchart LR
    A([POST /musics/sync<br/>AuthGuard + AdminGuard]) --> B[GET /tracks]
    B --> C{pour chaque track}
    C --> D{provider supporté ?}
    D -- non --> C
    D -- oui --> E{converterId<br/>déjà en base ?}
    E -- oui --> C
    E -- non --> F[(INSERT music)]
    F --> C
```

## Points à retenir

- **Une musique par média** : un second extrait d'une vidéo déjà présente est refusé, même si
  yt-converter le considérerait comme un track distinct.
- **URLs signées non stockées** : les colonnes `audio`/`thumbnail` restent vides ; à chaque
  lecture, le backend redemande le track au convertisseur pour obtenir une URL signée valide,
  puis relaie le flux. Tant que la conversion n'est pas finie, `/audio` répond 404.
- **Deux boucles de polling indépendantes** : la tâche serveur (15 s) met à jour la base, la
  popup (5 s) relit la base. Le délai perçu est donc au pire ~20 s après la fin réelle.
- **Échec côté popup** : la popup ne regarde que `converted` ; une musique passée `failed` reste
  affichée « en cours » et le polling continue tant que la popup est ouverte.
