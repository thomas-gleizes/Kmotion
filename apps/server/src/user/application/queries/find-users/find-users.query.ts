import { Query } from 'src/core/cqrs';
import { PaginatedUsers } from 'src/user/application/port/user-query-repository.port';

export type FindUsersQueryPayload = {
  page: number;
  size: number;
};

export class FindUsersQuery extends Query<PaginatedUsers> {
  constructor(public readonly payload: FindUsersQueryPayload) {
    super();
  }
}
