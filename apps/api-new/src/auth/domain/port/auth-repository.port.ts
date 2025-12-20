import { User } from 'src/user/domain/user.entity';

export const AUTH_REPOSITORY_PORT = Symbol('AUTH_REPOSITORY');

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<[User, string]>;
  save(user: User, password: string): Promise<void>;
}
