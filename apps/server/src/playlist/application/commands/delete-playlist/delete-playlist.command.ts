import { Command } from 'src/core/cqrs';

export type DeletePlaylistCommandPayload = {
  id: string;
  userId: string;
};

export class DeletePlaylistCommand extends Command<void> {
  constructor(public readonly payload: DeletePlaylistCommandPayload) {
    super();
  }
}
