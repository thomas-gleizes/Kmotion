import { Command } from 'src/core/cqrs';

export type RetryConversionCommandPayload = {
  musicId: string;
};

export class RetryConversionCommand extends Command<void> {
  constructor(public readonly payload: RetryConversionCommandPayload) {
    super();
  }
}
