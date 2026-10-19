import { api, authedFetch } from "@/shared/api/client"
import { unwrap } from "@/shared/api/query-keys"

type CacheEntry = { url: string | null; promise: Promise<string> }

// Cache des vignettes : l'endpoint exige le header Authorization, donc on
// télécharge en fetch authentifié et on expose des blob URLs.
const thumbnailCache = new Map<string, CacheEntry>()
const THUMBNAIL_MAX_ENTRIES = 150

function evictOldest(cache: Map<string, CacheEntry>, max: number) {
  for (const [path, entry] of cache) {
    if (cache.size <= max) break
    cache.delete(path)
    if (entry.url) URL.revokeObjectURL(entry.url)
  }
}

export function getBlobUrl(path: string): Promise<string> {
  const existing = thumbnailCache.get(path)
  if (existing) {
    // Rafraîchit la position LRU
    thumbnailCache.delete(path)
    thumbnailCache.set(path, existing)
    return existing.promise
  }

  const entry: CacheEntry = {
    url: null,
    promise: authedFetch(path).then((blob) => {
      entry.url = URL.createObjectURL(blob)
      return entry.url
    }),
  }
  entry.promise.catch(() => thumbnailCache.delete(path))
  thumbnailCache.set(path, entry)
  evictOldest(thumbnailCache, THUMBNAIL_MAX_ENTRIES)
  return entry.promise
}

// L'audio, lui, est lu en streaming : l'élément <audio> charge directement une
// URL signée (il ne sait pas envoyer le header Authorization) et démarre dès
// les premiers octets, les sauts passant par des requêtes Range. La mise en
// cache est laissée au cache HTTP du navigateur : l'URL d'un titre reste
// stable toute la journée (expiration arrondie côté serveur).
const streamUrls = new Map<string, { expires: number; promise: Promise<string> }>()
// Marge avant expiration : une URL presque périmée casserait un saut en cours
// de lecture.
const STREAM_URL_MIN_VALIDITY_MS = 60 * 60 * 1000

function expiresOf(url: string) {
  return Number(new URL(url, location.origin).searchParams.get("expires")) || 0
}

export function getStreamUrl(musicId: string): Promise<string> {
  const existing = streamUrls.get(musicId)
  if (existing && existing.expires - Date.now() > STREAM_URL_MIN_VALIDITY_MS) {
    return existing.promise
  }

  const entry = {
    // Optimiste le temps de la requête : les appels concurrents la partagent.
    expires: Infinity,
    promise: api
      .GET("/api/3.1/musics/{id}/stream-url", { params: { path: { id: musicId } } })
      .then((result) => {
        const { url } = unwrap(result)
        entry.expires = expiresOf(url)
        return url
      }),
  }
  entry.promise.catch(() => streamUrls.delete(musicId))
  streamUrls.set(musicId, entry)
  return entry.promise
}

/** Oublie l'URL signée d'un titre (ex : refusée par le serveur). */
export function invalidateStreamUrl(musicId: string) {
  streamUrls.delete(musicId)
}

// Préchargement du titre suivant : un fetch complet remplit le cache HTTP, que
// l'élément <audio> réutilise ensuite (y compris pour ses requêtes Range).
// Un seul à la fois : passer vite d'un titre à l'autre annule le précédent.
let preloadController: AbortController | null = null

export function preloadAudio(musicId: string) {
  preloadController?.abort()
  const controller = new AbortController()
  preloadController = controller
  void getStreamUrl(musicId)
    .then((url) => fetch(url, { signal: controller.signal }))
    .then((response) => response.arrayBuffer())
    .catch(() => {})
}

export function thumbnailPath(musicId: string) {
  return `/api/3.1/musics/${musicId}/thumbnail`
}
