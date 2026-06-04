import { User } from 'src/user/domain/user.entity';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { FindUsersQuery } from './find-users.query';

export type PaginatedResult<T> = { records: T[]; nextPage: string | null };

@QueryHandler(FindUsersQuery)
export class FindUsersHandler implements IQueryHandler<FindUsersQuery> {
  async execute(query: FindUsersQuery): Promise<PaginatedResult<User>> {
    return {
      records: [],
      nextPage: null,
    };
  }
}
