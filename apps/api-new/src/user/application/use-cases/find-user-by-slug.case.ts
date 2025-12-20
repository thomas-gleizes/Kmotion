import { UseCases } from 'src/core/models/use-cases.interface';
import { User } from 'src/user/domain/user.entity';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from 'src/user/domain/port/user-repository.port';
import { Inject } from '@nestjs/common';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

export type FindByIdValues = { slug: string };

export class FindUserBySlugCase implements UseCases<FindByIdValues, User> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(values: FindByIdValues): Promise<User> {
    const user = await this.userRepository.findBySlug(values.slug);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
