import { IQuery } from '@nestjs/cqrs';

export class FindByUserIdQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
