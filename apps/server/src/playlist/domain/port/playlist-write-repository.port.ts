import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';

export const PLAYLIST_WRITE_REPOSITORY = Symbol('PLAYLIST_WRITE_REPOSITORY');

export interface PlaylistWriteRepositoryPort {
  save(playlist: PlaylistEntity): Promise<void>;
  delete(playlistId: string): Promise<void>;
  findById(playlistId: string): Promise<PlaylistEntity>;
}
