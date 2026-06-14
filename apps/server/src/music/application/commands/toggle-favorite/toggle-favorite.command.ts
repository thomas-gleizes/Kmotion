import { Command } from 'src/core/cqrs';

export type ToggleFavoriteCommandPayload = {
  userId: string;
  musicId: string;
};

export type ToggleFavoriteCommandResult = {
  isFavorite: boolean;
};

export class ToggleFavoriteCommand extends Command<ToggleFavoriteCommandResult> {
  constructor(public readonly payload: ToggleFavoriteCommandPayload) {
    super();
  }
}
