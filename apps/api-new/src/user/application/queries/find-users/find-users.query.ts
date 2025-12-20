import { IQuery } from '@nestjs/cqrs';

export type FindUsersFilters = {};

export class FindUsersQuery implements IQuery {
  constructor(
    public readonly pageSize?: number,
    public readonly pageToken?: string,
    public readonly filters?: FindUsersFilters,
  ) {}
}
