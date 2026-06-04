import { Query } from 'src/core/cqrs';
import { UserRead } from 'src/user/application/port/user-query-repository.port';

export type GetProfileQueryPayload = { id: string };

export class GetProfileQuery extends Query<UserRead> {
  constructor(public readonly payload: GetProfileQueryPayload) {
    super();
  }
}
