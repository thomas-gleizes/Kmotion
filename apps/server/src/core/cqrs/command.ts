import {
  ICommand,
  ICommandHandler as NestICommandHandler,
  CommandHandler as NestCommandHandler,
  Constructor,
} from '@nestjs/cqrs';

export abstract class Command<Result> implements ICommand {
  protected result?: Result;
}

export type ResultTypeOfCommand<C> = C extends Command<infer R> ? R : never;

export type ICommandHandler<C extends Command<unknown>> = NestICommandHandler<
  C,
  ResultTypeOfCommand<C>
>;

export const CommandHandler: (
  command: Constructor<Command<unknown>>,
) => ClassDecorator = NestCommandHandler;
