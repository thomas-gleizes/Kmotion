import { User } from 'src/user/domain/user.entity';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from 'src/user/domain/port/user-repository.port';
import { Inject } from '@nestjs/common';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserBySlugQuery } from './find-user-by-slug.query';

@QueryHandler(FindUserBySlugQuery)
export class FindUserBySlugHandler implements IQueryHandler<
  FindUserBySlugQuery,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: FindUserBySlugQuery): Promise<User> {
    const user = await this.userRepository.findBySlug(query.slug);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
