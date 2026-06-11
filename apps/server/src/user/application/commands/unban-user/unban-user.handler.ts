import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { UnbanUserCommand } from 'src/user/application/commands/unban-user/unban-user.command';
import {
  USER_WRITE_REPOSITORY_PORT,
  type UserWriteRepositoryPort,
} from 'src/user/domain/port/user-write-repository.port';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@CommandHandler(UnbanUserCommand)
export class UnbanUserHandler implements ICommandHandler<UnbanUserCommand> {
  constructor(
    @Inject(USER_WRITE_REPOSITORY_PORT)
    private readonly userWriteRepository: UserWriteRepositoryPort,
  ) {}

  async execute(command: UnbanUserCommand): Promise<void> {
    const { userId } = command.payload;

    const user = await this.userWriteRepository.findById(userId);
    if (!user) throw new RessourceNotFoundException('User');

    await this.userWriteRepository.activate(userId);
  }
}
