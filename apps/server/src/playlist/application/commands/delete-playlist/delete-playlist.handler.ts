import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { DeletePlaylistCommand } from 'src/playlist/application/commands/delete-playlist/delete-playlist.command';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_WRITE_REPOSITORY,
  type PlaylistWriteRepositoryPort,
} from 'src/playlist/domain/port/playlist-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@CommandHandler(DeletePlaylistCommand)
export class DeletePlaylistHandler
  implements ICommandHandler<DeletePlaylistCommand>
{
  constructor(
    @Inject(PLAYLIST_WRITE_REPOSITORY)
    private readonly playlistWriteRepository: PlaylistWriteRepositoryPort,
  ) {}

  async execute(command: DeletePlaylistCommand) {
    const { id, userId } = command.payload;
    const playlist = await this.playlistWriteRepository.findById(id);

    if (!playlist.canBeModifiedBy(userId))
      throw new DomainException("You can't delete this playlist");

    await this.playlistWriteRepository.delete(playlist.getId());
  }
}
