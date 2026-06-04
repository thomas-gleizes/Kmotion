import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
import { UpdatePlaylistCommand } from 'src/playlist/application/commands/update-playlist/update-playlist.command';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_WRITE_REPOSITORY,
  type PlaylistWriteRepositoryPort,
} from 'src/playlist/domain/port/playlist-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@CommandHandler(UpdatePlaylistCommand)
export class UpdatePlaylistHandler
  implements ICommandHandler<UpdatePlaylistCommand>
{
  constructor(
    @Inject(PLAYLIST_WRITE_REPOSITORY)
    private readonly playlistWriteRepository: PlaylistWriteRepositoryPort,
  ) {}

  async execute(command: UpdatePlaylistCommand) {
    const { id, userId, title, description, visibility, entries } =
      command.payload;
    const playlist = await this.playlistWriteRepository.findById(id);

    if (!playlist.canBeModifiedBy(userId))
      throw new DomainException('You can not modify this playlist');

    if (title) playlist.setTitle(title);
    if (description) playlist.setDescription(description);
    if (visibility) playlist.setVisibility(visibility);
    if (entries) {
      // Clear and re-add or implement a better update logic in entity
      // For now, let's assume the entity has a way to replace entries or we use the PlaylistEntries VO
    }

    await this.playlistWriteRepository.save(playlist);
  }
}
