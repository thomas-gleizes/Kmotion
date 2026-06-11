import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { FindUsersQuery } from 'src/user/application/queries/find-users/find-users.query';
import {
  PaginatedUsers,
  USER_QUERY_REPOSITORY_PORT,
  type UserQueryRepositoryPort,
} from 'src/user/application/port/user-query-repository.port';

@QueryHandler(FindUsersQuery)
export class FindUsersHandler implements IQueryHandler<FindUsersQuery> {
  constructor(
    @Inject(USER_QUERY_REPOSITORY_PORT)
    private readonly userQueryRepository: UserQueryRepositoryPort,
  ) {}

  async execute(query: FindUsersQuery): Promise<PaginatedUsers> {
    const { page, size } = query.payload;

    return this.userQueryRepository.findAll({ page, size });
  }
}
