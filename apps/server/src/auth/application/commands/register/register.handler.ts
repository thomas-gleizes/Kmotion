import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { RegisterCommand } from 'src/auth/application/commands/register/register.command';
import { User } from 'src/user/domain/user.entity';
import {
  AUTH_REPOSITORY_PORT,
  type AuthRepositoryPort,
} from 'src/auth/domain/port/auth-repository.port';
import { Inject } from '@nestjs/common';
import {
  AUTH_SERVICE_PORT,
  type AuthServicePort,
} from 'src/auth/application/port/auth-service.port';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT)
    private readonly authRepository: AuthRepositoryPort,
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  async execute(command: RegisterCommand): Promise<void> {
    const { email, name, password } = command.payload;
    const user = User.create(email, name);
    const hash = await this.authService.hash(password);

    await this.authRepository.save(user, hash);
  }
}
