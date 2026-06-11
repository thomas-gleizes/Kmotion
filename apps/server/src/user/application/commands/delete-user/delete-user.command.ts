import { Command } from 'src/core/cqrs';

export type DeleteUserCommandPayload = {
  userId: string;
  currentUserId: string;
};

export class DeleteUserCommand extends Command<void> {
  constructor(public readonly payload: DeleteUserCommandPayload) {
    super();
  }
}
