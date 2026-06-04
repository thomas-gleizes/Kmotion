import { Command } from './command';
import { Query } from './query';

export * from './command';
export * from './query';

/*
 * Overriding query and command buses' execute methods to infer result types from query and commands.
 */
declare module '@nestjs/cqrs/dist/query-bus' {
  export interface QueryBus {
    execute<X>(query: Query<X>): Promise<X>;
  }
}

declare module '@nestjs/cqrs/dist/command-bus' {
  export interface CommandBus {
    execute<X>(command: Command<X>): Promise<X>;
  }
}
