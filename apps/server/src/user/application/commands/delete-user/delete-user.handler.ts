import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { DeleteUserCommand } from 'src/user/application/commands/delete-user/delete-user.command';
import {
  USER_WRITE_REPOSITORY_PORT,
  type UserWriteRepositoryPort,
} from 'src/user/domain/port/user-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_WRITE_REPOSITORY_PORT)
    private readonly userWriteRepository: UserWriteRepositoryPort,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { userId, currentUserId } = command.payload;

    if (userId === currentUserId) {
      throw new DomainException('You cannot delete yourself');
    }

    const user = await this.userWriteRepository.findById(userId);
    if (!user) throw new RessourceNotFoundException('User');

    await this.userWriteRepository.delete(userId);
  }
}
