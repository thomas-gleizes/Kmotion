import { User } from 'src/user/domain/user.entity';

export const USER_WRITE_REPOSITORY_PORT = Symbol('USER_WRITE_REPOSITORY_PORT');

export interface UserWriteRepositoryPort {
  save(user: User, password?: string): Promise<void>;
  activate(id: string): Promise<void>;
  deactivate(id: string): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
}
