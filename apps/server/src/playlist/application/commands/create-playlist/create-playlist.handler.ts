import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { CreatePlaylistCommand } from 'src/playlist/application/commands/create-playlist/create-playlist.command';
import { PlaylistEntity } from 'src/playlist/domain/playlist.entity';
import {
  PLAYLIST_WRITE_REPOSITORY,
  type PlaylistWriteRepositoryPort,
} from 'src/playlist/domain/port/playlist-write-repository.port';
import { Inject } from '@nestjs/common';

@CommandHandler(CreatePlaylistCommand)
export class CreatePlaylistHandler
  implements ICommandHandler<CreatePlaylistCommand>
{
  constructor(
    @Inject(PLAYLIST_WRITE_REPOSITORY)
    private readonly playlistWriteRepository: PlaylistWriteRepositoryPort,
  ) {}

  async execute(command: CreatePlaylistCommand): Promise<string> {
    const { title, description, userId, visibility, entries } = command.payload;
    const playlist = PlaylistEntity.create(
      title,
      description,
      userId,
      visibility,
      entries,
    );

    await this.playlistWriteRepository.save(playlist);

    return playlist.getId();
  }
}
