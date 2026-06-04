import { Command } from 'src/core/cqrs';

export type SyncMusicCommandPayload = void;

export class SyncMusicCommand extends Command<number> {
  constructor(public readonly payload: SyncMusicCommandPayload) {
    super();
  }
}
