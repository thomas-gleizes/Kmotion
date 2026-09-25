import { Command } from 'src/core/cqrs';

export type RefreshConversionsCommandPayload = void;

/** Updates pending musics from the converter; returns how many changed. */
export class RefreshConversionsCommand extends Command<number> {
  constructor(public readonly payload: RefreshConversionsCommandPayload) {
    super();
  }
}
