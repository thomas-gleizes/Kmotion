import { Music } from 'src/music/domain/music.entity';

export interface MusicCommandRepositoryPort {
  save(music: Music): Promise<void>;
  findById(id: string): Promise<Music>;
}
