import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/shared/api/client"
import { keys, unwrap } from "@/shared/api/query-keys"
import type { CreatePlaylistInput, UpdatePlaylistInput } from "@/shared/api/types"

export const playlistsQuery = queryOptions({
  queryKey: keys.playlists,
  queryFn: async () =>
    unwrap(await api.GET("/api/3.1/playlists", { params: { query: { page: 0, size: 100 } } })),
})

export const playlistQuery = (id: string) =>
  queryOptions({
    queryKey: keys.playlist(id),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/playlists/{id}", { params: { path: { id } } })),
  })

export function useCreatePlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreatePlaylistInput) =>
      unwrap(await api.POST("/api/3.1/playlists", { body, parseAs: "text" })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.playlists }),
  })
}

export function useUpdatePlaylist(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: UpdatePlaylistInput) =>
      unwrap(
        await api.PATCH("/api/3.1/playlists/{id}", {
          params: { path: { id } },
          body,
          parseAs: "text",
        }),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: keys.playlists })
      queryClient.invalidateQueries({ queryKey: keys.playlist(id) })
    },
  })
}

export function useDeletePlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) =>
      unwrap(
        await api.DELETE("/api/3.1/playlists/{id}", { params: { path: { id } }, parseAs: "text" }),
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.playlists }),
  })
}

export function useAddMusicToPlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { playlistId: string; musicId: string; position: number }) =>
      unwrap(
        await api.POST("/api/3.1/playlists/{id}/musics", {
          params: { path: { id: input.playlistId } },
          body: { musicId: input.musicId, position: input.position },
          parseAs: "text",
        }),
      ),
    onSuccess: (_data, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: keys.playlists })
      queryClient.invalidateQueries({ queryKey: keys.playlist(playlistId) })
    },
  })
}

export function useRemoveMusicFromPlaylist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: { playlistId: string; musicId: string }) =>
      unwrap(
        await api.DELETE("/api/3.1/playlists/{id}/musics/{musicId}", {
          params: { path: { id: input.playlistId, musicId: input.musicId } },
          parseAs: "text",
        }),
      ),
    onSuccess: (_data, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: keys.playlists })
      queryClient.invalidateQueries({ queryKey: keys.playlist(playlistId) })
    },
  })
}
