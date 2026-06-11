import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query"
import type { components } from "../../types/openapi"
import { api } from "./client"

export type Music = components["schemas"]["MusicResponseDto"]
export type Playlist = components["schemas"]["PlaylistResponseDto"]
export type PlaylistSummary = components["schemas"]["ManyPlaylistResponseDto"]
export type PlaylistEntry = components["schemas"]["PlaylistEntryResponseDto"]
export type User = components["schemas"]["UserDto"]
export type CreatePlaylistInput = components["schemas"]["CreatePlaylistDto"]
export type UpdatePlaylistInput = components["schemas"]["UpdatePlaylistDto"]
export type UpdateMusicInput = components["schemas"]["UpdateMusicDto"]

export const keys = {
  me: ["me"] as const,
  musics: (page: number, size: number) => ["musics", { page, size }] as const,
  musicSearch: (query: string) => ["musics", "search", query] as const,
  playlists: ["playlists"] as const,
  playlist: (id: string) => ["playlists", "detail", id] as const,
}

function unwrap<T>(result: { data?: T; error?: unknown }): T {
  if (result.error !== undefined) throw result.error
  return result.data as T
}

export const meQuery = queryOptions({
  queryKey: keys.me,
  queryFn: async () => unwrap(await api.GET("/api/3.1/users/me")),
})

export const musicsQuery = (page: number, size: number) =>
  queryOptions({
    queryKey: keys.musics(page, size),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/musics", { params: { query: { page, size } } })),
  })

export const musicSearchQuery = (query: string) =>
  queryOptions({
    queryKey: keys.musicSearch(query),
    queryFn: async () =>
      unwrap(await api.GET("/api/3.1/musics/search", { params: { query: { query } } })),
  })

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
