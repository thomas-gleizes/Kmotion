import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import {
  ToggleFavoriteCommand,
  ToggleFavoriteCommandResult,
} from './toggle-favorite.command';
import {
  FAVORITE_REPOSITORY_PORT,
  type FavoriteRepositoryPort,
} from 'src/music/domain/port/favorite-repository.port';

@CommandHandler(ToggleFavoriteCommand)
export class ToggleFavoriteHandler implements ICommandHandler<ToggleFavoriteCommand> {
  constructor(
    @Inject(FAVORITE_REPOSITORY_PORT)
    private readonly favoriteRepository: FavoriteRepositoryPort,
  ) {}

  async execute({
    payload,
  }: ToggleFavoriteCommand): Promise<ToggleFavoriteCommandResult> {
    const { userId, musicId } = payload;

    const isFavorite = await this.favoriteRepository.isFavorite(
      userId,
      musicId,
    );

    if (isFavorite) {
      await this.favoriteRepository.remove(userId, musicId);
    } else {
      await this.favoriteRepository.add(userId, musicId);
    }

    return { isFavorite: !isFavorite };
  }
}
