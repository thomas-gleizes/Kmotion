import { Command } from 'src/core/cqrs';

export type UnbanUserCommandPayload = {
  userId: string;
};

export class UnbanUserCommand extends Command<void> {
  constructor(public readonly payload: UnbanUserCommandPayload) {
    super();
  }
}
