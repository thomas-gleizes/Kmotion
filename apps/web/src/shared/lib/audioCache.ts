import { authedFetch } from "@/shared/api/client"

type CacheEntry = { url: string | null; promise: Promise<string> }

// Caches audio + thumbnails : les endpoints exigent le header Authorization,
// donc on télécharge en fetch authentifié et on expose des blob URLs.
// Deux caches distincts car les profils diffèrent : peu de gros fichiers audio
// vs. beaucoup de petites vignettes (grilles). Un LRU commun évincerait les
// vignettes trop vite en scroll.
const audioCache = new Map<string, CacheEntry>()
const thumbnailCache = new Map<string, CacheEntry>()
const AUDIO_MAX_ENTRIES = 15
const THUMBNAIL_MAX_ENTRIES = 150

function cacheFor(path: string) {
  return path.endsWith("/thumbnail")
    ? { cache: thumbnailCache, max: THUMBNAIL_MAX_ENTRIES }
    : { cache: audioCache, max: AUDIO_MAX_ENTRIES }
}

function evictOldest(cache: Map<string, CacheEntry>, max: number) {
  for (const [path, entry] of cache) {
    if (cache.size <= max) break
    cache.delete(path)
    if (entry.url) URL.revokeObjectURL(entry.url)
  }
}

export function getBlobUrl(path: string): Promise<string> {
  const { cache, max } = cacheFor(path)
  const existing = cache.get(path)
  if (existing) {
    // Rafraîchit la position LRU
    cache.delete(path)
    cache.set(path, existing)
    return existing.promise
  }

  const entry: CacheEntry = {
    url: null,
    promise: authedFetch(path).then((blob) => {
      entry.url = URL.createObjectURL(blob)
      return entry.url
    }),
  }
  entry.promise.catch(() => cache.delete(path))
  cache.set(path, entry)
  evictOldest(cache, max)
  return entry.promise
}

export function audioPath(musicId: string) {
  return `/api/3.1/musics/${musicId}/audio`
}

export function thumbnailPath(musicId: string) {
  return `/api/3.1/musics/${musicId}/thumbnail`
}
