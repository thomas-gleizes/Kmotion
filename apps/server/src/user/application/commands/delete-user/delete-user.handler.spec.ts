import { DeleteUserHandler } from './delete-user.handler';
import { DeleteUserCommand } from './delete-user.command';
import { UserWriteRepositoryPort } from 'src/user/domain/port/user-write-repository.port';
import { User } from 'src/user/domain/user.entity';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';
import { RessourceNotFoundException } from 'src/shared/domain/exceptions/ressource-not-found.exception';

describe('DeleteUserHandler', () => {
  let handler: DeleteUserHandler;
  let repository: jest.Mocked<UserWriteRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      activate: jest.fn(),
      deactivate: jest.fn(),
      delete: jest.fn(),
      findById: jest.fn(),
    } as any;
    handler = new DeleteUserHandler(repository);
  });

  it('should delete the target user', async () => {
    repository.findById.mockResolvedValue(
      new User('user-1', 'a@b.c', 'User', 'user', true, false),
    );

    await handler.execute(
      new DeleteUserCommand({ userId: 'user-1', currentUserId: 'admin-1' }),
    );

    expect(repository.delete).toHaveBeenCalledWith('user-1');
  });

  it('should refuse to delete yourself', async () => {
    await expect(
      handler.execute(
        new DeleteUserCommand({ userId: 'admin-1', currentUserId: 'admin-1' }),
      ),
    ).rejects.toThrow(DomainException);
    expect(repository.delete).not.toHaveBeenCalled();
  });

  it('should throw when the user does not exist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      handler.execute(
        new DeleteUserCommand({ userId: 'unknown', currentUserId: 'admin-1' }),
      ),
    ).rejects.toThrow(RessourceNotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
