import { useQuery, UseQueryResult } from "@tanstack/react-query"

interface useImageLoaderOptions {
  fallback?: string
  enabled?: boolean
}

export function useImageLoader(
  src: string | undefined,
  options?: useImageLoaderOptions
): [string | undefined, UseQueryResult<string>] {
  const queryImage = useQuery<string>({
    queryKey: ["image-loader", src],
    queryFn: () =>
      fetch(src as string)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    staleTime: Infinity,
    enabled: !!src && !(options?.enabled === true),
  })

  return [queryImage.data || options?.fallback, queryImage]
}
