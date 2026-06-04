import { Query } from 'src/core/cqrs';
import { UserRead } from 'src/user/application/port/user-query-repository.port';

export type FindUserByIdQueryPayload = { id: string };

export class FindUserByIdQuery extends Query<UserRead> {
  constructor(public readonly payload: FindUserByIdQueryPayload) {
    super();
  }
}
