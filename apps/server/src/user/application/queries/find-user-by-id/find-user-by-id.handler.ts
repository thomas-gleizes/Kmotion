import {
  USER_QUERY_REPOSITORY_PORT,
  type UserQueryRepositoryPort,
  type UserRead,
} from 'src/user/application/port/user-query-repository.port';
import { Inject } from '@nestjs/common';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { IQueryHandler, QueryHandler } from 'src/core/cqrs';
import { FindUserByIdQuery } from 'src/user/application/queries/find-user-by-id/find-user-by-id.query';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<FindUserByIdQuery> {
  constructor(
    @Inject(USER_QUERY_REPOSITORY_PORT)
    private readonly userRepository: UserQueryRepositoryPort,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<UserRead> {
    const user = await this.userRepository.findById(query.payload.id);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
