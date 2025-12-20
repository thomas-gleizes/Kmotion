import { MediaSource } from 'src/music/domain/music.entity';

export type MusicRead = {
  id: string;
  title: string;
  artist: string;
  channel: string;
  duration: number;
  audio: string;
  thumbnail: string;
};

export const MUSIC_READ_REPOSITORY_PORT = Symbol('MUSIC_READ_REPOSITORY_PORT');

export interface MusicReadRepositoryPort {
  exist(mediaId: string, mediaSource: MediaSource): Promise<boolean>;
}
