import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { api } from "../utils/Api"

interface useImageLoaderOptions {
  enabled?: boolean
}

export function useStreamLoader(
  id: number | undefined,
  options: useImageLoaderOptions,
): [string | undefined, UseQueryResult<string>] {
  const enabled = typeof options?.enabled === "boolean" ? options.enabled : true

  const query = useQuery<string>({
    queryKey: ["music-stream", id],
    queryFn: () => api.fetchMusic(id as number).then((blob) => URL.createObjectURL(blob)),
    staleTime: Infinity,
    enabled: !!id && enabled,
  })

  return [query.data, query]
}
