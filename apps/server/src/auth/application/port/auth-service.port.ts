import { User } from 'src/user/domain/user.entity';

export const AUTH_SERVICE_PORT = Symbol('AUTH_SERVICE_PORT');

export type AuthPayload = {
  sub: string;
  email: string;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
};

export interface AuthServicePort {
  sign(user: User): Promise<string>;
  verify(token: string): Promise<AuthPayload>;
  hash(password: string): string;
  compare(password: string, hash: string): boolean;
}
