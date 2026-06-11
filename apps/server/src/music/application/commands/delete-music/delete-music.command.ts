import { Command } from 'src/core/cqrs';

export type DeleteMusicCommandPayload = {
  musicId: string;
};

export class DeleteMusicCommand extends Command<void> {
  constructor(public readonly payload: DeleteMusicCommandPayload) {
    super();
  }
}
