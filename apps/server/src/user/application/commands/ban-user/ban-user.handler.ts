import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { BanUserCommand } from 'src/user/application/commands/ban-user/ban-user.command';
import {
  USER_WRITE_REPOSITORY_PORT,
  type UserWriteRepositoryPort,
} from 'src/user/domain/port/user-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(
    @Inject(USER_WRITE_REPOSITORY_PORT)
    private readonly userWriteRepository: UserWriteRepositoryPort,
  ) {}

  async execute(command: BanUserCommand): Promise<void> {
    const { userId, currentUserId } = command.payload;

    if (userId === currentUserId) {
      throw new DomainException('You cannot ban yourself');
    }

    const user = await this.userWriteRepository.findById(userId);
    if (!user) throw new RessourceNotFoundException('User');

    await this.userWriteRepository.deactivate(userId);
  }
}
