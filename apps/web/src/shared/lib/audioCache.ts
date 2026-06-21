import { authedFetch } from "@/shared/api/client"

type CacheEntry = { url: string | null; promise: Promise<string> }

// Cache partagé audio + thumbnails : les endpoints exigent le header Authorization,
// donc on télécharge en fetch authentifié et on expose des blob URLs.
const cache = new Map<string, CacheEntry>()
const MAX_ENTRIES = 40

function evictOldest() {
  for (const [path, entry] of cache) {
    if (cache.size <= MAX_ENTRIES) break
    cache.delete(path)
    if (entry.url) URL.revokeObjectURL(entry.url)
  }
}

export function getBlobUrl(path: string): Promise<string> {
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
  evictOldest()
  return entry.promise
}

export function audioPath(musicId: string) {
  return `/api/3.1/musics/${musicId}/audio`
}

export function thumbnailPath(musicId: string) {
  return `/api/3.1/musics/${musicId}/thumbnail`
}
