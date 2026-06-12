import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { LoginCommand } from 'src/auth/application/commands/login/login.command';
import { Inject } from '@nestjs/common';
import {
  AUTH_REPOSITORY_PORT,
  type AuthRepositoryPort,
} from 'src/auth/domain/port/auth-repository.port';
import {
  AUTH_SERVICE_PORT,
  type AuthServicePort,
} from 'src/auth/application/port/auth-service.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(AUTH_REPOSITORY_PORT)
    private readonly authRepository: AuthRepositoryPort,
    @Inject(AUTH_SERVICE_PORT)
    private readonly authService: AuthServicePort,
  ) {}

  async execute(command: LoginCommand): Promise<string> {
    const { email, password } = command.payload;
    const [user, passwordHash] = await this.authRepository.findByEmail(email);

    if (!user) {
      this.authService.hash(password);
      throw new DomainException('User not found');
    }

    if (!this.authService.compare(password, passwordHash)) {
      throw new DomainException("Password doesn't match");
    }

    if (!user.isActive) {
      throw new DomainException('Account not activated');
    }

    await this.authRepository.updateLastActivity(user.id);

    return this.authService.sign(user);
  }
}
