import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
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
    const playlist = await this.playlistWriteRepository.findById(command.id);

    if (!playlist.canBeModifiedBy(command.userId))
      throw new DomainException('You can not modify this playlist');

    if (command.title) playlist.setTitle(command.title);
    if (command.description) playlist.setDescription(command.description);
    if (command.visibility) playlist.setVisibility(command.visibility);
    if (command.entries) {
      // Clear and re-add or implement a better update logic in entity
      // For now, let's assume the entity has a way to replace entries or we use the PlaylistEntries VO
    }

    await this.playlistWriteRepository.save(playlist);
  }
}
