import { Visibility } from 'src/playlist/domain/values-object/visibility.value-object';
import { PaginateParameter } from 'src/core/paginations/paginations.type';

export const PLAYLIST_READ_REPOSITORY_PORT = Symbol(
  'PLAYLIST_READ_REPOSITORY_PORT',
);

export type UserPlaylistRead = {
  id: string;
  name: string;
  slug: string;
};

export type PlaylistEntryRead = {
  id: string;
  title: string;
  artist: string;
  channel: string;
  duration: number;
  thumbnail: string;
  audio: string;
  mediaId: string;
  mediaSource: string;
  position: number;
};

export type PlaylistRead = {
  id: string;
  title: string;
  description: string;
  visibility: Visibility;
  user: UserPlaylistRead;
  entries: PlaylistEntryRead[];
};

export type ManyPlaylistRead = {
  id: string;
  title: string;
  description: string;
  visibility: Visibility;
  user: UserPlaylistRead;
  entriesTotal: number;
  firstsMusicsIds: string[]; // First fours musics ids
};

export interface PlaylistQueryRepositoryPort {
  findByUserId(userId: string, currentUserId: string): Promise<ManyPlaylistRead[]>;
  findById(id: string): Promise<PlaylistRead | null>;
  findMany(
    parameter: PaginateParameter<{}, {}>,
    currentUserId: string,
  ): Promise<ManyPlaylistRead[]>;
}
