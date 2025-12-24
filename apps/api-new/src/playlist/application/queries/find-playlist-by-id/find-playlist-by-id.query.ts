import { IQuery } from '@nestjs/cqrs';

export class FindPlaylistByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
