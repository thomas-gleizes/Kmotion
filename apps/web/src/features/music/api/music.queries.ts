import { infiniteQueryOptions, queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/shared/api/client"
import { keys, unwrap } from "@/shared/api/query-keys"
import type { UpdateMusicInput } from "@/shared/api/types"

export type MusicSort = "title" | "artist" | "duration" | "createdAt" | "favorite"
export type SortOrder = "asc" | "desc"

export const musicsQuery = (page: number, size: number, search?: string) =>
  queryOptions({
    queryKey: keys.musics(page, size, search),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/musics", { params: { query: { page, size, search } } })),
  })

export const musicsInfiniteQuery = (
  size: number,
  sort?: MusicSort,
  order?: SortOrder,
  favorite?: boolean,
) =>
  infiniteQueryOptions({
    queryKey: ["musics", "infinite", { size, sort, order, favorite }] as const,
    queryFn: async ({ pageParam }) =>
      unwrap(
        await api.GET("/api/3.1/musics", {
          params: { query: { page: pageParam, size, sort, order, favorite } },
        }),
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      allPages.length * size < lastPage.total ? allPages.length : undefined,
  })

export const musicSearchQuery = (query: string) =>
  queryOptions({
    queryKey: keys.musicSearch(query),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/musics/search", { params: { query: { query } } })),
  })

export function useAddMusic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (mediaId: string) =>
      unwrap(
        await api.POST("/api/3.1/musics", {
          body: { mediaSource: "youtube", mediaId },
          parseAs: "text",
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["musics"] }),
  })
}

export function useDeleteMusic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.DELETE("/api/3.1/musics/{id}", {
          params: { path: { id } },
          parseAs: "text",
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["musics"] }),
  })
}

export function useToggleFavorite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.PUT("/api/3.1/musics/{id}/favorite", {
          params: { path: { id } },
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["musics"] }),
  })
}

export function useSyncMusics() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => unwrap(await api.POST("/api/3.1/musics/sync", { parseAs: "text" })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["musics"] }),
  })
}

export function useUpdateMusic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { id: string; body: UpdateMusicInput }) =>
      unwrap(
        await api.PATCH("/api/3.1/musics/{id}", {
          params: { path: { id: input.id } },
          body: input.body,
        }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["musics"] }),
  })
}
