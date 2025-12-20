import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindMusicsQuery } from 'src/music/application/queries/find-musics/find-musics.query';

@QueryHandler(FindMusicsQuery)
export class FindMusicsHandler implements IQueryHandler<FindMusicsQuery> {
  execute(query: FindMusicsQuery): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
