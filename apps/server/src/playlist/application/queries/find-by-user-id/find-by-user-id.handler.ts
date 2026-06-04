import { FindByUserIdQuery } from 'src/playlist/application/queries/find-by-user-id/find-by-user-id.query';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';

@QueryHandler(FindByUserIdQuery)
export class FindByUserIdHandler implements IQueryHandler<FindByUserIdQuery> {
  constructor() {}

  async execute(query: FindByUserIdQuery): Promise<any> {
    return [];
  }
}
