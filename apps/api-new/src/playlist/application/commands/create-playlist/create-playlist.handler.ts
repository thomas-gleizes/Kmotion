import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
    const playlist = PlaylistEntity.create(
      command.title,
      command.description,
      command.userId,
      command.visibility,
      command.entries,
    );

    await this.playlistWriteRepository.save(playlist);

    return playlist.getId();
  }
}
