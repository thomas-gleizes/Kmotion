import { BanUserHandler } from './ban-user.handler';
import { BanUserCommand } from './ban-user.command';
import { UserWriteRepositoryPort } from 'src/user/domain/port/user-write-repository.port';
import { User } from 'src/user/domain/user.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

const buildUser = () =>
  new User('user-1', 'a@b.c', 'User', 'user', true, false);

describe('BanUserHandler', () => {
  let handler: BanUserHandler;
  let repository: jest.Mocked<UserWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new BanUserHandler(repository);
  });

  it('should deactivate the target user', async () => {
    repository.findById.mockResolvedValue(buildUser());

    await handler.execute(
      new BanUserCommand({ userId: 'user-1', currentUserId: 'admin-1' }),
    );

    expect(repository.deactivate).toHaveBeenCalledWith('user-1');
  });

  it('should refuse to ban yourself', async () => {
    await expect(
      handler.execute(
        new BanUserCommand({ userId: 'admin-1', currentUserId: 'admin-1' }),
      ),
    ).rejects.toThrow(DomainException);
    expect(repository.deactivate).not.toHaveBeenCalled();
  });

  it('should throw when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(
        new BanUserCommand({ userId: 'unknown', currentUserId: 'admin-1' }),
      ),
    ).rejects.toThrow(RessourceNotFoundException);
    expect(repository.deactivate).not.toHaveBeenCalled();
  });
});
