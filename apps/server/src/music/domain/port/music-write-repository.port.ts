import { Music } from 'src/music/domain/music.entity';

export const MUSIC_WRITE_REPOSITORY_PORT = Symbol('MUSIC_WRITE_REPOSITORY');

export interface MusicWriteRepositoryPort {
  save(music: Music): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Music | null>;
}
