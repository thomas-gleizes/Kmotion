import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMusicFromPlaylistCommand } from './remove-music-from-playlist.command';
import { Inject } from '@nestjs/common';
import {
  PLAYLIST_WRITE_REPOSITORY,
  type PlaylistWriteRepositoryPort,
} from 'src/playlist/domain/port/playlist-write-repository.port';
import { DomainException } from 'src/shared/domain/exceptions/domain.exception';

@CommandHandler(RemoveMusicFromPlaylistCommand)
export class RemoveMusicFromPlaylistHandler
  implements ICommandHandler<RemoveMusicFromPlaylistCommand>
{
  constructor(
    @Inject(PLAYLIST_WRITE_REPOSITORY)
    private readonly playlistWriteRepository: PlaylistWriteRepositoryPort,
  ) {}

  async execute(command: RemoveMusicFromPlaylistCommand) {
    const playlist = await this.playlistWriteRepository.findById(
      command.playlistId,
    );

    if (!playlist.canBeModifiedBy(command.userId)) {
      throw new DomainException('You can not modify this playlist');
    }

    playlist.removeMusic(command.musicId);

    await this.playlistWriteRepository.save(playlist);
  }
}
