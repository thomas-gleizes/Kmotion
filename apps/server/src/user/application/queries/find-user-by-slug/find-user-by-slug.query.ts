import { Query } from 'src/core/cqrs';
import { UserRead } from 'src/user/application/port/user-query-repository.port';

export type FindUserBySlugQueryPayload = { slug: string };

export class FindUserBySlugQuery extends Query<UserRead> {
  constructor(public readonly payload: FindUserBySlugQueryPayload) {
    super();
  }
}
