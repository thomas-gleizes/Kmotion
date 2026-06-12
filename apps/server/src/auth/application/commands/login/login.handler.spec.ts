import { LoginHandler } from './login.handler';
import { LoginCommand } from './login.command';
import { AuthRepositoryPort } from 'src/auth/domain/port/auth-repository.port';
import { AuthServicePort } from 'src/auth/application/port/auth-service.port';
import { User } from 'src/user/domain/user.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

const buildUser = (isActive: boolean) =>
  new User('user-1', 'a@b.c', 'User', 'user', isActive, false);

describe('LoginHandler', () => {
  let handler: LoginHandler;
  let repository: jest.Mocked<AuthRepositoryPort>;
  let authService: jest.Mocked<AuthServicePort>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as any;
    authService = {
      hash: jest.fn(),
      compare: jest.fn(),
      sign: jest.fn().mockResolvedValue('jwt-token'),
      verify: jest.fn(),
    } as any;
    handler = new LoginHandler(repository, authService);
  });

  const command = new LoginCommand({ email: 'a@b.c', password: 'secret' });

  it('should return a token for an active user with valid credentials', async () => {
    repository.findByEmail.mockResolvedValue([buildUser(true), 'hash']);
    authService.compare.mockReturnValue(true);

    await expect(handler.execute(command)).resolves.toBe('jwt-token');
    expect(authService.compare).toHaveBeenCalledWith('secret', 'hash');
  });

  it('should reject an invalid password', async () => {
    repository.findByEmail.mockResolvedValue([buildUser(true), 'hash']);
    authService.compare.mockReturnValue(false);

    await expect(handler.execute(command)).rejects.toThrow(DomainException);
    expect(authService.sign).not.toHaveBeenCalled();
  });

  it('should reject an inactive account even with valid credentials', async () => {
    repository.findByEmail.mockResolvedValue([buildUser(false), 'hash']);
    authService.compare.mockReturnValue(true);

    await expect(handler.execute(command)).rejects.toThrow(
      'Account not activated',
    );
    expect(authService.sign).not.toHaveBeenCalled();
  });
});
