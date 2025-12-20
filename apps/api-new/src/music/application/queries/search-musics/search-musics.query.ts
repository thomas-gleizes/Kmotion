import { IQuery } from '@nestjs/cqrs';

export class SearchMusicsQuery implements IQuery {
  constructor(public readonly query: string) {}
}
