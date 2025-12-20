import { Inject } from '@nestjs/common';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from 'src/user/domain/port/user-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { User } from 'src/user/domain/user.entity';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfileQuery } from './get-profile.query';

@QueryHandler(GetProfileQuery)
export class GetProfileHandler implements IQueryHandler<GetProfileQuery, User> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetProfileQuery) {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
