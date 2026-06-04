import { CommandHandler, ICommandHandler } from 'src/core/cqrs';
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
    const { playlistId, userId, musicId } = command.payload;
    const playlist = await this.playlistWriteRepository.findById(playlistId);

    if (!playlist.canBeModifiedBy(userId)) {
      throw new DomainException('You can not modify this playlist');
    }

    playlist.removeMusic(musicId);

    await this.playlistWriteRepository.save(playlist);
  }
}
