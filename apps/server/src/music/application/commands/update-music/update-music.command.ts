import { Command } from 'src/core/cqrs';

export type UpdateMusicCommandPayload = {
  musicId: string;
  title?: string;
  artist?: string;
};

export class UpdateMusicCommand extends Command<void> {
  constructor(public readonly payload: UpdateMusicCommandPayload) {
    super();
  }
}
