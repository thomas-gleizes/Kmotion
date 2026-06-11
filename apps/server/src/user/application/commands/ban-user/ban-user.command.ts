import { Command } from 'src/core/cqrs';

export type BanUserCommandPayload = {
  userId: string;
  currentUserId: string;
};

export class BanUserCommand extends Command<void> {
  constructor(public readonly payload: BanUserCommandPayload) {
    super();
  }
}
