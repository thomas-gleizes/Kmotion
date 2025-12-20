import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
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
export class RegisterHandler implements IQueryHandler<RegisterCommand, string> {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT)
    private readonly authRepository: AuthRepositoryPort,
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  async execute(command: RegisterCommand): Promise<string> {
    const user = User.create(command.email, command.name);
    const hash = await this.authService.hash(command.password);

    await this.authRepository.save(user, hash);

    return this.authService.sign(user);
  }
}
