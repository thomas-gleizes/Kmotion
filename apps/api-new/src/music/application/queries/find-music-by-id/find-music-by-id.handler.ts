import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindMusicByIdQuery } from 'src/music/application/queries/find-music-by-id/find-music-by-id.query';

@QueryHandler(FindMusicByIdQuery)
export class FindMusicByIdHandler implements IQueryHandler<FindMusicByIdQuery> {
  async execute(query: FindMusicByIdQuery): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
