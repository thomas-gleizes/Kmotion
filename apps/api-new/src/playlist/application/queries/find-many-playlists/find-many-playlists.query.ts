import { IQuery } from '@nestjs/cqrs';
import { PaginateParameter } from 'src/core/paginations/paginations.type';

export class FindManyPlaylistsQuery implements IQuery {
  constructor(public readonly params: PaginateParameter<{}, {}>) {}
}
