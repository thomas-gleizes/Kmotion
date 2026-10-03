import { MusicRead } from 'src/music/application/port/music-read-repository.port';
import { Query } from 'src/core/cqrs';

export class FindConversionsQuery extends Query<MusicRead[]> {
  constructor(public readonly payload: void) {
    super();
  }
}
