import type { components } from "../../../types/openapi"

// Types de domaine dérivés du schéma OpenAPI : contrat d'API partagé,
// consommé par plusieurs features (music, playlist, admin, auth).
export type Music = components["schemas"]["MusicResponseDto"]
export type Playlist = components["schemas"]["PlaylistResponseDto"]
export type PlaylistSummary = components["schemas"]["ManyPlaylistResponseDto"]
export type PlaylistEntry = components["schemas"]["PlaylistEntryResponseDto"]
export type User = components["schemas"]["UserDto"]
export type CreatePlaylistInput = components["schemas"]["CreatePlaylistDto"]
export type UpdatePlaylistInput = components["schemas"]["UpdatePlaylistDto"]
export type UpdateMusicInput = components["schemas"]["UpdateMusicDto"]
