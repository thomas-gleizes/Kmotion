import { Query } from 'src/core/cqrs';
import { PaginatedResult } from 'src/user/application/queries/find-users/find-users.handler';
import { User } from 'src/user/domain/user.entity';

export type FindUsersFilters = {};

export type FindUsersQueryPayload = {
  pageSize?: number;
  pageToken?: string;
  filters?: FindUsersFilters;
};

export class FindUsersQuery extends Query<PaginatedResult<User>> {
  constructor(public readonly payload: FindUsersQueryPayload) {
    super();
  }
}
