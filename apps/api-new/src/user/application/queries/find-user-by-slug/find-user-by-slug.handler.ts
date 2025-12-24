import {
  USER_QUERY_REPOSITORY_PORT,
  type UserQueryRepositoryPort,
  type UserRead,
} from 'src/user/application/port/user-query-repository.port';
import { Inject } from '@nestjs/common';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserBySlugQuery } from './find-user-by-slug.query';

@QueryHandler(FindUserBySlugQuery)
export class FindUserBySlugHandler
  implements IQueryHandler<FindUserBySlugQuery, UserRead>
{
  constructor(
    @Inject(USER_QUERY_REPOSITORY_PORT)
    private readonly userRepository: UserQueryRepositoryPort,
  ) {}

  async execute(query: FindUserBySlugQuery): Promise<UserRead> {
    const user = await this.userRepository.findBySlug(query.slug);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
