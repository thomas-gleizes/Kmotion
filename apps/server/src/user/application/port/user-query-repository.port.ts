export type UserRead = {
  id: string;
  email: string;
  name: string;
  slug: string;
  isActive: boolean;
  isAdmin: boolean;
};

export const USER_QUERY_REPOSITORY_PORT = Symbol('USER_QUERY_REPOSITORY_PORT');

export type PaginatedUsers = { records: UserRead[]; total: number };

export interface UserQueryRepositoryPort {
  findById(id: string): Promise<UserRead | null>;
  findByEmail(email: string): Promise<UserRead | null>;
  findBySlug(slug: string): Promise<UserRead | null>;
  findAll(pagination: { page: number; size: number }): Promise<PaginatedUsers>;
}
