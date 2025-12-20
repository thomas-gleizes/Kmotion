import { MusicCommandRepositoryPort } from 'src/music/domain/port/music-command-repository.port';
import { Music } from 'src/music/domain/music.entity';

export class MusicCommandRepository implements MusicCommandRepositoryPort {
  findById(id: string): Promise<Music> {
    throw new Error('Method not implemented.');
  }

  save(music: Music): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
