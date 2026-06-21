// Clés de cache React Query et helper de déballage partagés entre toutes les
// features : centralisés ici car certaines mutations invalident les clés
// d'un autre domaine.
export const keys = {
  me: ["me"] as const,
  musics: (page: number, size: number, search?: string) =>
    ["musics", { page, size, search }] as const,
  musicSearch: (query: string) => ["musics", "search", query] as const,
  playlists: ["playlists"] as const,
  playlist: (id: string) => ["playlists", "detail", id] as const,
  users: (page: number, size: number) => ["users", { page, size }] as const,
}

export function unwrap<T>(result: { data?: T; error?: unknown }): T {
  if (result.error !== undefined) throw result.error
  return result.data as T
}
