import { IQuery } from '@nestjs/cqrs';

export class FindMusicByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
