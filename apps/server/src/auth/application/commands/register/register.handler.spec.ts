import { RegisterHandler } from './register.handler';
import { RegisterCommand } from './register.command';
import { AuthRepositoryPort } from 'src/auth/domain/port/auth-repository.port';
import { AuthServicePort } from 'src/auth/application/port/auth-service.port';
import { User } from 'src/user/domain/user.entity';

describe('RegisterHandler', () => {
  let handler: RegisterHandler;
  let repository: jest.Mocked<AuthRepositoryPort>;
  let authService: jest.Mocked<AuthServicePort>;

  beforeEach(() => {
    repository = {
      findByEmail: jest.fn(),
      save: jest.fn(),
    } as any;
    authService = {
      hash: jest.fn().mockReturnValue('hashed-password'),
      compare: jest.fn(),
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;
    handler = new RegisterHandler(repository, authService);
  });

  const command = new RegisterCommand({
    email: 'new@user.io',
    name: 'New User',
    password: 'secret',
  });

  it('should save an inactive user with the hashed password', async () => {
    await handler.execute(command);

    expect(repository.save).toHaveBeenCalledTimes(1);
    const [savedUser, savedHash] = repository.save.mock.calls[0];
    expect(savedUser).toBeInstanceOf(User);
    expect(savedUser.email).toBe('new@user.io');
    expect(savedUser.isActive).toBe(false);
    expect(savedHash).toBe('hashed-password');
  });

  it('should not issue a token', async () => {
    const result = await handler.execute(command);

    expect(result).toBeUndefined();
    expect(authService.sign).not.toHaveBeenCalled();
  });
});
