import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from 'src/user/domain/port/user-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';
import { UseCases } from 'src/core/models/use-cases.interface';
import { User } from 'src/user/domain/user.entity';

export type GetProfileValues = { id: string };

@Injectable()
export class GetProfileCase implements UseCases<GetProfileValues, User> {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(values: GetProfileValues) {
    console.log('Values', values);
    const user = await this.userRepository.findById(values.id);

    if (!user) {
      throw new RessourceNotFoundException('user');
    }

    return user;
  }
}
