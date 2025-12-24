import { IQuery } from '@nestjs/cqrs';

export class FindUserPlaylistsQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
