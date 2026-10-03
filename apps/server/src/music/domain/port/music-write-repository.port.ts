import { Music } from 'src/music/domain/music.entity';
import { ConversionStatus } from 'src/music/domain/values-object/conversion-status.value-object';

export const MUSIC_WRITE_REPOSITORY_PORT = Symbol('MUSIC_WRITE_REPOSITORY');

export interface MusicWriteRepositoryPort {
  save(music: Music): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Music | null>;
  findByConversionStatuses(statuses: ConversionStatus[]): Promise<Music[]>;
}
