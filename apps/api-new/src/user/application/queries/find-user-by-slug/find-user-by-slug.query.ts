import { IQuery } from '@nestjs/cqrs';

export class FindUserBySlugQuery implements IQuery {
  constructor(public readonly slug: string) {}
}
