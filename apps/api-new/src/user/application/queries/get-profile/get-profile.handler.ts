import { Inject } from '@nestjs/common';
import {
  USER_QUERY_REPOSITORY_PORT,
  type UserQueryRepositoryPort,
  type UserRead,
} from 'src/user/application/port/user-query-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from './get-profile.query';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler
  implements IQueryHandler<GetProfileQuery, UserRead>
{
  constructor(
    @Inject(USER_QUERY_REPOSITORY_PORT)
    private readonly userRepository: UserQueryRepositoryPort,
  ) {}

  async execute(query: GetProfileQuery): Promise<UserRead> {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
