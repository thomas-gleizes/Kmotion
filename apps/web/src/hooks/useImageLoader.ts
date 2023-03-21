import { UseQueryResult, useQuery } from "@tanstack/react-query"

export function useImageLoader(src?: string): [string, UseQueryResult<string>] {
  const queryImage = useQuery<string>({
    queryKey: ["image-loader", src],
    queryFn: () =>
      fetch(src as string)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob)),
    staleTime: Infinity,
    enabled: !!src,
  })

  return [queryImage.data || "/images/placeholder.png", queryImage]
}
