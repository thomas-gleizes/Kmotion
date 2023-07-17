import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { api } from "../utils/Api"

interface useImageLoaderOptions {
  fallback?: string
  enabled?: boolean
}

export function useImageLoader(
  id: number | undefined,
  options?: useImageLoaderOptions,
): [string | undefined, UseQueryResult<string>] {
  const enabled = typeof options?.enabled === "boolean" ? options.enabled : true

  const queryImage = useQuery<string>({
    queryKey: ["music-image", id],
    queryFn: () => api.fetchCover(id as number).then((blob) => URL.createObjectURL(blob)),
    staleTime: Infinity,
    enabled: !!id && enabled,
  })

  return [queryImage.data || options?.fallback, queryImage]
}
