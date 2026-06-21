import { useEffect, useState } from "react"
import { getBlobUrl } from "@/shared/lib/audioCache"

type State = {
  path: string | null
  url: string | null
  error: boolean
}

export function useAuthedBlobUrl(path: string | null) {
  const [state, setState] = useState<State>({ path, url: null, error: false })

  // Reset pendant le rendu quand la cible change (pattern « derived state »)
  if (state.path !== path) {
    setState({ path, url: null, error: false })
  }

  useEffect(() => {
    if (!path) return
    let cancelled = false
    getBlobUrl(path)
      .then((blobUrl) => {
        if (!cancelled) setState({ path, url: blobUrl, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ path, url: null, error: true })
      })
    return () => {
      cancelled = true
    }
  }, [path])

  const isCurrent = state.path === path
  return { url: isCurrent ? state.url : null, error: isCurrent && state.error }
}
