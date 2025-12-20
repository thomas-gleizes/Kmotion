import { UseCases } from 'src/core/models/use-cases.interface';
import { User } from 'src/user/domain/user.entity';

export type FindUsersValues = {
  pageSize: number;
  pageToken: string;
  filters: {};
};
export type PaginatedResult<T> = { records: T[]; nextPage: string | null };

export class FindUsersCase implements UseCases<FindUsersValues> {
  execute(values: FindUsersValues): Promise<PaginatedResult<User>> | unknown {
    return {};
  }
}
