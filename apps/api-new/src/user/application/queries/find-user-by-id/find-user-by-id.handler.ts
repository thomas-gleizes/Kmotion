import { User } from 'src/user/domain/user.entity';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from 'src/user/domain/port/user-repository.port';
import { Inject } from '@nestjs/common';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindUserByIdQuery } from 'src/user/application/queries/find-user-by-id/find-user-by-id.query';

@QueryHandler(FindUserByIdQuery)
export class FindUserByIdHandler implements IQueryHandler<
  FindUserByIdQuery,
  User
> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: FindUserByIdQuery): Promise<User> {
    const user = await this.userRepository.findById(query.id);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
