import {
  Constructor,
  IQuery,
  IQueryHandler as NestIQueryHandler,
  QueryHandler as NestQueryHandler,
} from '@nestjs/cqrs';

export abstract class Query<R> implements IQuery {
  protected result?: R;
}

export type ResultTypeOfQuery<Q> = Q extends Query<infer R> ? R : never;

export type IQueryHandler<Q extends Query<unknown>> = NestIQueryHandler<
  Q,
  ResultTypeOfQuery<Q>
>;

export const QueryHandler: (
  query: Constructor<Query<unknown>>,
) => ClassDecorator = NestQueryHandler;
